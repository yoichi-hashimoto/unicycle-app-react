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
  const isCleared = skill.level <= currentLevel;

  return (
    <>
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
            <p className={classes.level}>{skill.level}</p>
          </div>
          <p className={classes.levelName}>{skill.name}</p>
        </div>
        <div className={classes.technicalImg}>
          <img src={skill.avatar_path} alt="技の写真" />
        </div>
        <div className={classes.detailButton}>
          <p className={classes.skillCategory}>{skill.category}</p>
          <p className={classes.skillCategory}>{skill.skill_family}</p>
          <Button onClick={() => setIsOpen(true)}>説明</Button>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <h2>{skill.name}</h2>
            <div className={classes.categoryWrapper}>
              {" "}
              <p className={classes.categoryButton}>{skill.level_label}</p>
              <p className={classes.categoryButton}>レベル {skill.level}</p>
              <p className={classes.categoryButton}>派手さ {skill.showiness}</p>
              <p className={classes.categoryButton}>
                {skill.performance_type}
              </p>{" "}
              <p className={classes.categoryButton}>{skill.skill_family}</p>
            </div>
            <img src={skill.avatar_path} className={classes.modalImg} alt="" />
            <p>{skill.description}</p>
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
