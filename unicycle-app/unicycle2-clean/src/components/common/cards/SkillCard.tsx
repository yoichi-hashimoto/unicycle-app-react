import classes from "./SkillCard.module.scss";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import { useState } from "react";
import type { SkillType } from "../type/skill";
import { useAuthStore } from "../../../stores/authStore";

type SkillProps = {
  skill: SkillType;
};

function SkillCard({ skill }: SkillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const currentLevel = user?.current_level ?? 0;
  const isCleared = skill.required_level <= currentLevel;

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
            <img src={skill.avatar_path} alt="技の写真" />
          </div>
          <div className={classes.detailButton}>
            <div className={classes.skillCategory}>
              <h3>{skill.point}</h3>
              <p>ポイント</p>
            </div>
            <Button onClick={() => setIsOpen(true)}>説明</Button>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <div className={classes.categoryWrapper}>
              <h2>{skill.name}</h2>
            </div>
            <img src={skill.avatar_path} className={classes.modalImg} alt="" />
            <p className={classes.description}>{skill.description}</p>
            <div></div>
            <button>
              <Link to={skill.movie_path}>動画を見る</Link>
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default SkillCard;
