import MemberCard from "../../common/cards/MemberCard";
import { useState, useEffect } from "react";
import classes from "./Test.module.css";
import Button from "../../common/button/Button";
import { fetchUsers } from "../../../api/users";

// const members = [
//   {
//     id: 1,
//     name: "yoichi",
//     level: 10,
//     avatar: "./images/users/boy_1.png",
//     receivedLikes: 20,
//     animalAvatar: "./images/animals/stand_chick.png",
//     nextSkill: "片足走行　10m",
//   },
//   {
//     id: 2,
//     name: "james",
//     level: 2,
//     avatar: "./images/users/girl_2.png",
//     receivedLikes: 100,
//     animalAvatar: "./images/animals/stand_fox.png",
//     nextSkill: "アリーナ3周",
//   },
// ];

function Test() {
  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [success, setSuccess] = useState(0);
  const [level, setLevel] = useState(0);
  useEffect(() => {
    fetchUsers().then((data) => {
      console.log(data);
      const fetchedUsers = data.data;
      setUsers(data);

      if (data.length > 0) {
        setSelectedMember(data[0]);
        setLevel(data[0].current_level);
      }
    });
  }, []);

  if (!selectedMember) {
    return <p>Loading...</p>;
  }

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
  const resetSuccess = () => {
    setSuccess(0);
  };

  const handleChangeMember = (e) => {
    const memberId = Number(e.target.value);
    console.log(memberId);
    const user = users.find((user) => user.id === memberId);

    setSelectedMember(user);
    console.log(user);
    setSuccess(0);
    setLevel(user.current_level);
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
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.memberWrapper}>
          {" "}
          <MemberCard
            member={selectedMember}
            level={level}
            success={success}
            showSkill={false}
          />
        </div>
      </div>
      <div className={classes.nextChallenge}>
        <h2>チャレンジするわざ</h2>
        <div className={classes.starContainer}>
          <p>{selectedMember.skill_name}</p>
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
        <Button variant="danger" onClick={resetSuccess}>
          失敗💦
        </Button>
      </div>
    </div>
  );
}

export default Test;
