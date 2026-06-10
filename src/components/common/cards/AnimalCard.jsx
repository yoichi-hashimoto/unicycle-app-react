import React from 'react'
import classes from "./Animal.module.scss";

function AnimalCard({ animal }) {
    return (
      <div className={classes.animalCard}>
        <div className={classes.animalTitle}>
          <p>現在の動物ランク</p>
          <span className={classes.line}></span>
          <h2>{animal.name}</h2>
        </div>
        <div className={classes.avatarContainer}>
          <div className={classes.animalImage}>
            <img src={animal.avatar} alt={animal.name} />
          </div>
          <span className={classes.shadow}></span>
        </div>
        <div className={classes.remainLevel}>
          <p>次の動物まで</p>
          <p>あと{}レベル</p>
        </div>
      </div>
    );
}

export default AnimalCard