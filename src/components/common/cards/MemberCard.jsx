import React from "react";
import classes from "./Member.module.scss";

function MemberCard({ member, showButton = true ,success,level,showSkill=true}) {
  return (
    <>
      <div className={classes.memberWrapper}>
        <div className={classes.memberContainer}>
          <h3>{member.name}</h3>
          <div className={classes.avatarContainer}>
            <img
              src={member.avatar}
              alt="Member Image"
              className={classes.memberAvatar}
            />
            {showButton && (
              <img
                src={member.animalAvatar}
                alt={member.animalAvatar}
                className={classes.animalAvatar}
              />)}
            <div className={ classes.receivedLikes }>
              <p className={classes.heart}>❤</p>
              <p className={classes.count}>{member.receivedLikes}</p>
            </div>
          </div>
          <div className={classes.ribbon}>
            <span>Lv. {level}</span>
          </div>
          {showSkill && (<div className={classes.challengeWrapper}
            style={{
              textAlign: "start",
              backgroundColor: "white",
              padding: "0 1rem 0.5rem 1rem",
              borderRadius: "10px",
              width: "80%",
              border: "0.5px solid rgb(56, 215, 56)",
            }}
          >
            <div className={classes.challengeContainer}>
              <p style={{ fontSize: "8px" }}>チャレンジ中の技</p>{" "}
              <div className={classes.starContainer}>
                {[1, 2, 3].map((star) => (
                  <img className={`${classes.star} ${star <= success ? classes.starFilled : ""}`} key={star} src={star <= success ? "./images/star_filled.png" : "./images/star_blank.png"} alt="star" />
                ))}
              </div>
            </div>
            <span className={classes.line}></span>
            <p className={classes.challengeText}>{member.nextSkill}</p>
          </div>)}
        </div>
      </div>
    </>
  );
}

export default MemberCard;
