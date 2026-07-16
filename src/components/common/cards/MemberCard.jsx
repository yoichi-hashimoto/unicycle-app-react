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
          <div
            className={classes.avatarContainer}
            style={{ backgroundColor: member.color_path }}
          >
            <img
              src={member.avatar_path}
              alt={member.name}
              className={classes.memberAvatar}
            />
            {showButton && (
              <div className={classes.animalWrapper}><img
                src={member.current_animal?.avatar_path}
                alt={member.animalAvatar}
                className={classes.animalAvatar} />
                <img src={member.equipped_item_path} className={classes.selectedItem} alt="" />
              </div>
            )}
            <div className={classes.receivedLikes}>
              <p className={classes.heart}>❤</p>
              <p className={classes.count}>{member.received_likes}</p>
            </div>
          </div>
          <div className={classes.ribbon}>
            <span>Lv. {level}</span>
          </div>
          {showSkill && (
            <div className={classes.challengeWrapper}>
              <div className={classes.challengeContainer}>
                <p style={{ fontSize: "8px" }}>チャレンジ中の技</p>{" "}
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
              <p className={classes.challengeText}>{member.skill_name}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MemberCard;
