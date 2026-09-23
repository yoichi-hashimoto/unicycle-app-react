import classes from "./SkillCard.module.scss";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import React, { useState } from "react";
import type { SkillType } from "../type/skill";
import { useAuthStore } from "../../../stores/authStore";
import TipCard from "./TipCard";
import axios from "../../../api/axios";

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      return;
    }
    const confirmed = window.confirm("投稿しますか？");
    if (!confirmed) {
      return;
    }
    try {
      const response = await axios.post(`./api/skill/${skill.id}/tips`, {
        text: formData.text,
      });
      setTips((prev) => [...prev, response.data]);

      setFormData({ text: "" });
    } catch (error) {
      console.error(error);
    }
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
              <img
                src="/images/icons/comment_bubble.svg"
                alt="comment_bubble"
              />
              <p>{skill.skill_tips.length}</p>
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
            <Button onClick={() => setIsOpen(true)}>詳しく</Button>
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
              <TipCard skillTips={tips} />
              <div className={classes.tipsWrapper}>
                {" "}
                <div className={classes.userWrapper}>
                  {" "}
                  <img src={user?.avatar_path} alt="user" />
                  <p>{user?.name}</p>
                </div>{" "}
                {user && (
                  <textarea
                    className={classes.tipsText}
                    placeholder="コメントを書いて投稿ボタンを押してください"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                  ></textarea>
                )}
              </div>{" "}
              <div className={classes.submitButton}>
                <Button variant="primary" onClick={handleSubmit}>
                  投稿
                </Button>
              </div>
            </div>{" "}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default SkillCard;
