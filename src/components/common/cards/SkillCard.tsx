import classes from "./SkillCard.module.scss";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import React, { useState } from "react";
import type { SkillType } from "../type/skill";
import { useAuthStore } from "../../../stores/authStore";
import TipCard from "./TipCard";
import axios from "../../../api/axios";
import { clubLabel } from "../../../utils/club";

type SkillProps = {
  skill: SkillType;
};

function SkillCard({ skill }: SkillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const currentLevel = user?.current_level ?? 0;
  const isCleared = skill.required_level < currentLevel;
  const [formData, setFormData] = useState({
    text: "",
  });

  const [tips, setTips] = useState(skill.skill_tips ?? []);
  const [unreadCount, setUnreadCount] = useState(skill.unread_tip_count ?? 0);
  const [commentError, setCommentError] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
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
        <div
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
            {skill.required_level >= 26 && (
              <div className={classes.skillCategory}>
                <h3>{skill.point}</h3>
                <p>ポイント</p>
              </div>
            )}
            <Button onClick={handleOpen}>詳しく</Button>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <div className={classes.categoryWrapper}>
              <h2>{skill.name}</h2>
              {skill.required_level >= 26 && (
                <div className={classes.skillCategory}>
                  <h3>{skill.point}</h3>
                  <p>ポイント</p>
                </div>
              )}
            </div>
            <img src={skill.avatar_path} className={classes.modalImg} alt="" />
            <p className={classes.description}>{skill.description}</p>
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
