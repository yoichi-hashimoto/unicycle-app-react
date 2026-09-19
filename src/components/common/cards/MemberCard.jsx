import React from "react";
import classes from "./Member.module.scss";

function MemberCard({
  member,
  showButton = true,
  success,
  level,
  showSkill = true,
}) {
  return (
    <>
      <div className={classes.memberWrapper}>
        <div className={classes.memberContainer}>
          <h3>{member.name}</h3>
          <div className={classes.avatarStage}>
          {showButton && (
            <div className={classes.animalWrapper}>
              <img
                src={member.current_animal?.avatar_path}
                alt={member.animalAvatar}
                className={classes.animalAvatar}
              />
              {member.equipped_item_path && (
                <img
                  src={member.equipped_item_path}
                  className={classes.selectedItem}
                  alt="item"
                />
              )}
            </div>
          )}
          <div
            className={classes.avatarContainer}
            style={{ backgroundColor: member.color_path }}
          >
            <img
              src={member.avatar_path}
              alt="Member"
              className={classes.memberAvatar}
            />
            <div className={classes.receivedLikes}>
              <p className={classes.heart}>❤</p>
              <p className={classes.count}>{member.received_likes}</p>
            </div>
            </div>
            </div>
          <div className={classes.ribbon}>
            <span>Lv. {level}</span>
          </div>
          {showSkill ? (
            <div className={classes.challengeWrapper}>
              <div className={classes.challengeContainer}>
                <p>チャレンジ中の技</p>{" "}
                <div className={classes.starContainer}>
                  {[1, 2, 3].map((star) => (
                    <img
                      className={`${classes.star} ${star <= success ? classes.starFilled : ""}`}
                      key={star}
                      src={
                        star <= success
                          ? "./images/star_filled.png"
                          : "./images/star_blank.png"
                      }
                      alt="star"
                    />
                  ))}
                </div>
              </div>
              <span className={classes.line}></span>
              {member.current_level <= 25 ? (
                <p className={classes.challengeText}>{member.skill_name}</p>
              ) : (
                <p className={classes.challengeText}>基礎コースクリア済み！</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default MemberCard;
