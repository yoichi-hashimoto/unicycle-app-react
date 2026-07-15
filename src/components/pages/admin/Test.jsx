import MemberCard from "../../common/cards/MemberCard";
import { useState, useEffect } from "react";
import classes from "./Test.module.css";
import Button from "../../common/button/Button";
import { fetchUsers } from "../../../api/users";
import axios from "../../../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import ItemCard from "../../common/cards/ItemCard";

function Test() {
  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [success, setSuccess] = useState(0);
  const navigate = useNavigate();
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

  const addSuccess = async () => {
    const nextSuccess = success + 1;
    setSuccess(nextSuccess);

    if (nextSuccess >= 3) {
      const nextLevel = level + 1;

      const submitData = {
            user_id: selectedMember.id,
            current_level: level,
            success_score: 3,
          };

          try {
            await axios.get("./sanctum/csrf-cookie");
            await axios.post("./api/challenges", submitData);

            navigate("/challenge");
          } catch (error) {
            console.error("エラー", error);
          }
        }

    return;
    setSuccess(nextSuccess);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      user_id: selectedMember.id,
      current_level: level,
      success_score: success,
    };
    console.log("送信前：", submitData);
    if (!window.confirm("本当に送信しますか？")) {
      return;
    }

    try {
      await axios.get("./sanctum/csrf-cookie");
      await axios.post("./api/challenges", submitData);

      navigate("/challenge");
    } catch (error) {
      console.error("エラー", error);
    }
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
              <option name="user_id" key={user.id} value={user.id}>
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
            name="current_level"
            value={level}
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
              name="success_score"
              value={success}
            />
          ))}
        </div>
      </div>
      <div className={classes.testButtons}>
        <Button variant="primary" onClick={addSuccess}>
          成功👍
        </Button>
      </div>
      <div className={classes.submitButton}>
        <Button variant="outline" onClick={handleSubmit}>
          失敗💦
        </Button>
      </div>
    </div>
  );
}

export default Test;
