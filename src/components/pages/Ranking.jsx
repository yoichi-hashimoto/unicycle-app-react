import { useState } from "react";
import MemberCard from "../common/cards/MemberCard";
import Button from "./../common/button/Button";
import classes from "./PageCommon.module.css";

const memberList = [
  {
    id: 1,
    name: "よういち",
    level: 10,
    avatar: "./images/users/boy_1.png",
    receivedLikes: 3,
    animalAvatar: "./images/animals/stand_fox.png",
    nextSkill: "普通走行壁から壁まで",
    success: 2,
  },
  {
    id: 2,
    name: "ゆうき",
    level: 15,
    avatar: "./images/users/girl_2.png",
    receivedLikes: 200,
    animalAvatar: "./images/animals/stand_rabbit.png",
    nextSkill: "あめ玉スピン",
    success: 1,
  },
  {
    id: 3,
    name: "なお",
    level: 35,
    avatar: "./images/users/girl_4.png",
    receivedLikes: 35,
    animalAvatar: "./images/animals/stand_tiger.png",
    nextSkill: "バック走行50m",
    success: 3,
  },
];

function Ranking() {
  const [member, setMember] = useState(memberList);
  const sortByLevel = () => {
    const sortedMembers = [...memberList].sort((a, b) => b.level - a.level);
    setMember(sortedMembers);
  };

  const sortByLike = () => {
    const sortedMembers = [...memberList].sort(
      (a, b) => b.receivedLikes - a.receivedLikes,
    );
    setMember(sortedMembers);
  };

  return (
    <div className={classes.contentsWrapper}>
      <h2>ランキング</h2>
      <div className={classes.buttonWrapper}>
        <Button variant="outline">チャレンジ日付でソート</Button>
        <Button onClick={sortByLevel} variant="outline" color="primary">
          レベルでソート
        </Button>
        <Button onClick={sortByLike} variant="outline">
          ❤でソート
        </Button>
      </div>
      <div className={ classes.cardContainer }>
        {member.map((member) => (
          <MemberCard key={member.id} member={member} level={member.level} nextSkill={member.nextSkill} success={member.success}/>
        ))}
      </div>
    </div>
  );
}

export default Ranking;
