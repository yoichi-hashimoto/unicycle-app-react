import MemberCard from "../../common/cards/MemberCard";
import { useState } from "react";
import classes from "./Test.module.css";
import Button from "../../common/button/Button";

const members = [
  {
    id: 1,
    name: "yoichi",
    level: 10,
    avatar: "./images/users/boy_1.png",
    receivedLikes: 20,
    animalAvatar: "./images/animals/stand_chick.png",
    nextSkill: "片足走行　10m",
  },
  {
    id: 2,
    name: "james",
    level: 2,
    avatar: "./images/users/girl_2.png",
    receivedLikes: 100,
    animalAvatar: "./images/animals/stand_fox.png",
    nextSkill: "アリーナ3周",
  },
];

function Test() {
  const [selectedMember, setSelectedMember] = useState(members[0]);
  const [success, setSuccess] = useState(0);
  const [level, setLevel] = useState(members[0].level);
  const addSuccess = () => {
    setSuccess((prev) => {
      const next = prev + 1;

      if (next >= 4) {
        setLevel((prevLevel) => prevLevel + 1);
        return 0;
      }
      return next;
    });
  };
  const handleChangeMember = (e) => {
    const memberId = Number(e.target.value);
    const member = members.find((member) => member.id === memberId);

    setSelectedMember(member);
    setSuccess(0);
    setLevel(member.level);
  };

  return (
    <div className={classes.testContainer}>
      <h1>🔥レベルアップテスト🔥</h1>
      <div className={classes.challengeWrapper}>
        <div className={classes.challengeSelector}>
          <h2>チャレンジャーを選択する</h2>
          <select
            name="memberSelector"
            id="selector"
            onChange={handleChangeMember}
            value={selectedMember.id}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.memberWrapper}>
          {" "}
          <MemberCard
            member={{ ...selectedMember, level: level }}
            success={success}
            showSkill={false}
          />
        </div>
      </div>
      <div className={classes.nextChallenge}>
        <h2>チャレンジするわざ</h2>
        <div className={classes.starContainer}>
          <p>{selectedMember.nextSkill}</p>
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
      <div className={classes.testButtons}>
        <Button variant="outline" onClick={addSuccess}>
          成功👍
        </Button>
        <Button variant="danger">失敗💦</Button>
      </div>
    </div>
  );
}

export default Test;
