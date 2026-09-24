import React from 'react'
import classes from "./Animal.module.scss";

function AnimalCard({ animal, remainLevel, currentLevel }) {
  const positions = [
    { bottom: 10, left: 25 }, // Lv1
    { bottom: 25, left: 40 }, // Lv2
    { bottom: 37, left: 25 }, // Lv3
    { bottom: 50, left: 45 }, // Lv4
    { bottom: 63, left: 30}, // Lv5
  ];

  const levelInMountain = ((currentLevel - 1) % positions.length) +1;
  const position = positions[levelInMountain - 1];

    return (
      <div className={classes.animalCard}>
        <div className={classes.animalTitle}>
          <p>現在の<br></br>動物ランク</p>
          <span className={classes.line}></span>
          <h2>{animal.name}</h2>
        </div>
        <div className={classes.avatarContainer}>
          <div className={classes.animalImage}>
            <img
              src="./images/mountain_light.png"
              alt=""
              className={classes.mountain}
            />
            <img
              src={animal.avatar_path_walk}
              alt={animal.name}
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