import React from 'react'
import classes from "./Animal.module.scss";
import { Link } from "react-router-dom";
import { beginnerSteps, getDisplayAnimal } from "../../../features/beginner/beginnerProgress";

function AnimalCard({ animal, remainLevel, currentLevel, beginnerMode = false, beginnerStep = 1 }) {
  const displayAnimal = getDisplayAnimal({
    beginner_mode: beginnerMode, beginner_step: beginnerStep, current_animal: animal,
  });
  const positions = [
    { bottom: 10, left: 25 }, // Lv1
    { bottom: 25, left: 40 }, // Lv2
    { bottom: 37, left: 25 }, // Lv3
    { bottom: 50, left: 45 }, // Lv4
    { bottom: 63, left: 30}, // Lv5
  ];

  const levelInMountain = ((currentLevel - 1) % positions.length) +1;
  const position = positions[levelInMountain - 1];

    if (!displayAnimal) return null;

    if (beginnerMode && beginnerStep < 6) {
      return (
        <div className={classes.animalCard}>
          <div className={classes.animalTitle}>
            <p>現在の<br />動物ランク</p>
            <span className={classes.line}></span>
            <h2>たまご</h2>
          </div>
          <div className={classes.beginnerAnimal}>
            <img src={displayAnimal.avatar_path} alt={`たまご ステップ${displayAnimal.beginner_step}`} />
            <p>{beginnerSteps[displayAnimal.beginner_step - 1].title}</p>
            <p>初心者コース {displayAnimal.beginner_step} / 6</p>
            <Link to="/beginner">続きを進める</Link>
          </div>
        </div>
      );
    }

    return (
      <div className={classes.animalCard}>
        <div className={classes.animalTitle}>
          <p>現在の<br></br>動物ランク</p>
          <span className={classes.line}></span>
          <h2>{displayAnimal.name}</h2>
        </div>
        <div className={classes.avatarContainer}>
          <div className={classes.animalImage}>
            <img
              src="./images/mountain_light.png"
              alt=""
              className={classes.mountain}
            />
            <img
              src={displayAnimal.avatar_path_walk}
              alt={displayAnimal.name}
              className={classes.animal}
              style={{
                left: `${position.left}%`,
              bottom:`${position.bottom}%`}}
            />
            <div className={classes.remainLevel}>
              <p>あと<br></br>{remainLevel}レベル</p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AnimalCard
