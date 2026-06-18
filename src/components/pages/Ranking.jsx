import { useState,useEffect } from "react";
import MemberCard from "../common/cards/MemberCard";
import Button from "./../common/button/Button";
import classes from "./PageCommon.module.css";
import { fetchUsers } from "../../api/users";

// const memberList = [
//   {
//     id: 1,
//     name: "よういち",
//     level: 10,
//     avatar: "./images/users/boy_1.png",
//     receivedLikes: 3,
//     animalAvatar: "./images/animals/stand_fox.png",
//     nextSkill: "普通走行壁から壁まで",
//     success: 2,
//   },
//   {
//     id: 2,
//     name: "ゆうき",
//     level: 15,
//     avatar: "./images/users/girl_2.png",
//     receivedLikes: 200,
//     animalAvatar: "./images/animals/stand_rabbit.png",
//     nextSkill: "あめ玉スピン",
//     success: 1,
//   },
//   {
//     id: 3,
//     name: "なお",
//     level: 35,
//     avatar: "./images/users/girl_4.png",
//     receivedLikes: 35,
//     animalAvatar: "./images/animals/stand_tiger.png",
//     nextSkill: "バック走行50m",
//     success: 3,
//   },
// ];

function Ranking() {
    const [users, setUsers] = useState([]);

  // const [member, setMember] = useState([]);
  const sortByLevel = () => {
    const sortedMembers = [...users].sort((a, b) => b.current_level - a.current_level);
    setUsers(sortedMembers);
  };

  const sortByLike = () => {
    const sortedMembers = [...users].sort(
      (a, b) => b.received_likes - a.received_likes,
    );
    setUsers(sortedMembers);
  };

  useEffect(() => {
    fetchUsers().then((users) => {
      console.log(users);
      setUsers(users);
    })
  },[]);

  if (!users) {
    return <p>Loading...</p>
  }


  return (
    <div className={classes.contentsWrapper}>
      <h1>ランキング</h1>
      <div className={classes.sortbuttonWrapper}>
        <Button variant="outline">新しい順</Button>
        <Button onClick={sortByLevel} variant="outline" color="primary">
          レベル順
        </Button>
        <Button onClick={sortByLike} variant="outline">
          ❤の数順
        </Button>
      </div>
      <div className={ classes.cardContainer }>
        {users.map((user) => (
          <MemberCard key={user.id} member={user} level={user.current_level} skill={user.skill} success={user.success_score ?? null}/>
        ))}
      </div>
    </div>
  );
}

export default Ranking;
