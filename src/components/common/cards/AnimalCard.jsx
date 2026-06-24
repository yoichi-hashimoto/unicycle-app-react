import React from 'react'
import classes from "./Animal.module.scss";

function AnimalCard({ animal, remainLevel, currentLevel }) {
  const positions = [
    { bottom: 5, left: 40 }, // Lv1
    { bottom: 35, left: 70 }, // Lv2
    { bottom: 65, left: 35 }, // Lv3
    { bottom: 95, left: 75 }, // Lv4
    { bottom: 125, left: 45}, // Lv5
  ];

  const levelInMountain = ((currentLevel - 1) % positions.length) +1;
  const position = positions[levelInMountain - 1];

  console.log(position);
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
              src="./images/mountain.png"
              alt=""
              className={classes.mountain}
            />
            <img
              src={animal.avatar_path_walk}
              alt={animal.name}
              className={classes.animal}
              style={{
                left: `${position.left}px`,
              bottom:`${position.bottom}px`}}
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