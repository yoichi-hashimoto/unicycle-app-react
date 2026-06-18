import React, { useState } from "react";
import classes from "./History.module.scss";

const jadgePass = (history) => {
  if (history.success_score === "3") {
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
  const [liked, setLiked] = useState(history.received_likes);

  const hundleLike = () => {
    setIsLiked((prev) => !prev);
    setLiked((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const isPassed = history.success_score === "3";

  return (
    <>
      <div className={`${classes.historyContainer} ${isPassed ? classes.passed : classes.fail}`}>
        {/* <div className={isPassed ? classes.passed : classes.fail}> */}
          <div>
            <p className={classes.date}>
              {formattedDateMonth(new Date(history.created_at))}
            </p>
            <p className={classes.date}>
              {formattedDateDay(new Date(history.created_at))}
            </p>
          </div>
          <div className={classes.avatarContainer}>
            <img
              src={history.user_avatar_path}
              alt={history.user_name}
              className={classes.avatar}
            />
            <img
              src={history.current_animal}
              alt={history.animalAvatar}
              className={classes.animalAvatar}
            />
            <p className={classes.userName}>{history.user_name}</p>
          </div>
          <div className={classes.challengeContainer}>
            <div className={classes.levelContainer}>
              <h2>レベル{history.current_level}</h2>{" "}
              <div className={classes.starContainer}>
                {[1, 2, 3].map((star) => (
                  <img
                    className={`${classes.star} ${star <= history.success_score ? classes.starFilled : ""}`}
                    key={star}
                    src={
                      star <= history.success_score
                        ? "./images/star_filled.png"
                        : "./images/star_blank.png"
                    }
                    alt="star"
                  />
                ))}
              </div>
            </div>
            <p className={classes.challengeResult}>
              {history.skill_name}に"{jadgePass(history)}"しました！
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
      {/* </div> */}
    </>
  );
};

export default HistoryCard;
