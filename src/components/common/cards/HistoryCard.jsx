import React, { useState } from "react";
import classes from "./History.module.scss";
import AnimalCard from "./AnimalCard";

const jadgePass = (is_passed) => {
  if (is_passed) {
    return "合格";
  } else {
    return "チャレンジ";
  }
};

const formattedDateMonth = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
}).format;

const formattedDateDay = new Intl.DateTimeFormat("ja-JP", {
  day: "numeric",
}).format;

const HistoryCard = ({ history, showButton = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [liked, setLiked] = useState(history.receivedLikes);

  const hundleLike = () => {
    setIsLiked((prev) => !prev);
    setLiked((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <>
      <div className={classes.historyContainer}>
        <div className={history.is_passed ? classes.passed : classes.fail}>
          <div>
            <p className={classes.date}>
              {formattedDateMonth(new Date(history.date))}
            </p>
            <p className={classes.date}>
              {formattedDateDay(new Date(history.date))}
            </p>
          </div>
          <div className={classes.avatarContainer}>
            <img
              src={history.avatar}
              alt={history.user_name}
              className={classes.avatar}
            />
            <img
              src={history.animalAvatar}
              alt={history.animalAvatar}
              className={classes.animalAvatar}
            />
            <p className={classes.userName}>{history.user_name}</p>
          </div>
          <div className={classes.levelContainer}>
            <h2>レベル{history.level}</h2>
            <p className={classes.challengeResult}>
              {history.challenge}に"{jadgePass(history.is_passed)}"しました！
            </p>
          </div>
          <div className={classes.likeContainer}>
            <div className={classes.receivedLikesContainer}>
              {!isLiked ? (
                <button className={classes.unlike}>&#9825;</button>
              ) : (
                <button
                  className={`${classes.likeIllustration} ${isLiked ? classes.bounce : ""}`}
                >
                  ❤
                </button>
              )}

              <p>{liked}</p>
            </div>
            {showButton && (
              <button onClick={hundleLike} className={classes.likeButton}>
                ❤を押す
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryCard;
