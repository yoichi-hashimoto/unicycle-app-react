import classes from "./SkillCard.module.scss";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import React, { useState } from "react";
import type { SkillType } from "../type/skill";
import { useAuthStore } from "../../../stores/authStore";
import TipCard from "./TipCard";
import axios from "../../../api/axios";
import { clubLabel } from "../../../utils/club";
import { isBasicSkill } from "../../../features/roadmap/catalog";

type SkillProps = {
  skill: SkillType;
  variant?: "grid" | "roadmap";
  onTargetSelected?: (user: any) => void | Promise<void>;
};

function SkillCard({ skill, variant = "grid", onTargetSelected }: SkillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const currentLevel = user?.current_level ?? 0;
  const isBasic = isBasicSkill(skill);
  const isCleared = skill.is_cleared ?? (isBasic && skill.required_level < currentLevel);
  const [formData, setFormData] = useState({
    text: "",
  });

  const [tips, setTips] = useState(skill.skill_tips ?? []);
  const [unreadCount, setUnreadCount] = useState(skill.unread_tip_count ?? 0);
  const [commentError, setCommentError] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [savingTarget, setSavingTarget] = useState(false);
  const [targetError, setTargetError] = useState("");

  const selectTarget = async () => {
    if (savingTarget || !skill.is_available || !user || user.role === "gurdian") return;
    const userId = user.id;
    setSavingTarget(true); setTargetError("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.patch("/api/user/skill-target", { skill_id: skill.id });
      if (useAuthStore.getState().user?.id !== userId) return;
      useAuthStore.getState().setUser(response.data.data);
      await onTargetSelected?.(response.data.data);
      setIsOpen(false);
    } catch (error: any) {
      setTargetError(error.response?.data?.errors?.skill_id?.[0] ?? "目標を保存できませんでした。再度お試しください。");
    } finally { setSavingTarget(false); }
  };

  const handleOpen = async () => {
    setIsOpen(true);
    setTargetError("");
    setCommentsLoading(true); setCommentError("");
    try {
      const response = await axios.get(`/api/skill/${skill.id}/tips`);
      setTips(response.data);
      await axios.patch(`/api/skill/${skill.id}/tips/read`);
      setUnreadCount(0);
    } catch (error) {
      setCommentError("コメントを読み込めませんでした。開き直してお試しください。");
      console.error("comment read update failed", error);
    } finally { setCommentsLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.text.trim() || posting || commentsLoading) {
      return;
    }
    const confirmed = window.confirm("投稿しますか？");
    if (!confirmed) {
      return;
    }
    setPosting(true); setCommentError("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(`/api/skill/${skill.id}/tips`, {
        text: formData.text,
      });
      setTips((prev) => [...prev, response.data]);

      setFormData({ text: "" });
    } catch (error) {
      setCommentError("コメントを保存できませんでした。");
      console.error(error);
    } finally { setPosting(false); }
  };

  return (
    <>
      <div>
        {variant === "roadmap" ? <article className={`${classes.roadmapCard} ${isCleared ? classes.roadmapCleared : ""} ${skill.is_current ? classes.roadmapCurrent : ""}`}>
          <button type="button" className={classes.roadmapOpen} onClick={handleOpen}
            aria-label={`${isBasic ? `レベル${skill.required_level} ` : ""}${skill.name}の詳細${isCleared ? "（クリア済み）" : ""}`}>
            <span className={classes.roadmapEyebrow}>{isBasic ? `Lv${skill.required_level}` : skill.category}<span>{isBasic ? isCleared ? "✓" : "" : `+${skill.point ?? 0} pt`}</span></span>
            <img src={skill.avatar_path} alt="" loading="lazy" />
            <strong>{skill.name}</strong>
            <span className={classes.roadmapState}>{isCleared ? "✓ クリア済み・振り返る" : skill.is_current ? "いま挑戦中" : skill.is_available ? "チャレンジできる" : "これからの技"}</span>
            <span className={classes.roadmapComment}>コメント {tips.length}{unreadCount > 0 ? `（未読 ${unreadCount}）` : ""}</span>
          </button>
        </article> : <div
          className={`${isCleared ? classes.cardCleared : classes.cardContainer}`}
        >
          <div className={classes.levelDisplay}>
            {isCleared && (
              <div className={classes.clearedSign}>
                <p>クリア</p>
              </div>
            )}
            <div className={classes.levelNumber}>
              <p className={classes.level}>{skill.required_level}</p>
            </div>
            <p className={classes.levelName}>{skill.name}</p>
          </div>
          <div className={classes.technicalImg}>
            <div className={classes.commentBubble}>
              {unreadCount > 0 && (
                <span className={classes.unreadDot} aria-label={`未読コメント ${unreadCount}件`} />
              )}
              <img
                src="/images/icons/comment_bubble.svg"
                alt="comment_bubble"
              />
              <p>{tips.length}</p>
            </div>
            <img src={skill.avatar_path} alt="技の写真" loading="lazy" />
          </div>

          <div className={classes.detailButton}>
            {!isBasic && (
              <div className={classes.skillCategory}>
                <h3>{skill.point}</h3>
                <p>ポイント</p>
              </div>
            )}
            <Button onClick={handleOpen}>詳しく</Button>
          </div>
        </div>}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <div className={classes.categoryWrapper}>
              <h2>{skill.name}</h2>
              {!isBasic && (
                <div className={classes.skillCategory}>
                  <h3>{skill.point}</h3>
                  <p>ポイント</p>
                </div>
              )}
            </div>
            <img src={skill.avatar_path} className={classes.modalImg} alt="" />
            <p className={classes.description}>{skill.description}</p>
            <div className={classes.targetPanel}>
              <p>{isCleared ? "達成済みの技です。コツやコメントを振り返れます。" : skill.locked_reason ?? (isBasic ? "3回成功で次のレベルへ進みます。" : "初回合格時にポイントを獲得できます。")}</p>
              {!isBasic && !!skill.prerequisite_names?.length && <p>前提の技：{skill.prerequisite_names.join("・")}</p>}
              {!!skill.required_pair_skills && <p>ペア・演技系の技を{skill.required_pair_skills}つ以上達成</p>}
              {!isBasic && !isCleared && user?.role !== "gurdian" && <Button variant="primary" disabled={savingTarget || !skill.is_available || skill.is_current} onClick={selectTarget}>
                {savingTarget ? "保存中…" : skill.is_current ? "現在の目標です" : "この技を目標にする"}
              </Button>}
              {targetError && <p role="alert">{targetError}</p>}
            </div>
            <div className={classes.commentTitle}>
              <div className={classes.titleWrapper}>
                <h3>コメント</h3>
              </div>
              <p>👆成功のコツや失敗しやすい点などをコメントしよう！</p>
              {commentsLoading ? <p role="status">コメントを読み込み中…</p> : <TipCard skillTips={tips} skillId={skill.id} onTipsChange={setTips} />}
              {commentError && <p role="alert">{commentError}</p>}
              {user?.role !== "gurdian" && <div className={classes.tipsWrapper}>
                {" "}
                <div className={classes.userWrapper}>
                  {" "}
                  <img src={user?.avatar_path} alt="user" />
                  <p>{user?.name}<br /><small>{clubLabel(user?.club_name)}</small></p>
                </div>{" "}
                {user && (
                  <textarea
                    className={classes.tipsText}
                    placeholder="コメントを書いて投稿ボタンを押してください"
                    name="text"
                    maxLength={255}
                    disabled={posting || commentsLoading}
                    value={formData.text}
                    onChange={handleChange}
                  ></textarea>
                )}
              </div>}{" "}
              {user?.role !== "gurdian" && <div className={classes.submitButton}>
                <Button variant="primary" onClick={handleSubmit} disabled={posting || commentsLoading}>
                  投稿
                </Button>
              </div>}
            </div>{" "}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default SkillCard;
