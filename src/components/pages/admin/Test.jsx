import MemberCard from "../../common/cards/MemberCard";
import { useState, useEffect } from "react";
import classes from "./Test.module.css";
import Button from "../../common/button/Button";
import { fetchUsers } from "../../../api/users";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

function Test() {
  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const categories = ["基礎", "ソロ中級", "ペア"];
  const [selectedCategory, setSelectedCategory] = useState("基礎");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [success, setSuccess] = useState(0);
  const navigate = useNavigate();
  const [level, setLevel] = useState(0);

  useEffect(() => {
    fetchUsers().then((data) => {
      // const fetchedUsers = data.data;
      setUsers(data);

      if (data.length > 0) {
        setSelectedMember(data[0]);
        setLevel(data[0].current_level);
      }
    });
  }, []);

  const nextSkills = selectedMember?.remain_skills?.next_skill ?? [];

  const filteredSkills = nextSkills.filter(
    (skill) => skill.category === selectedCategory,
  );

  useEffect(() => {
    if (!selectedMember) return;
    if (selectedCategory === "基礎") {
      setSelectedSkill(selectedMember.remain_skills?.basic_skill ?? null);
      return;
    }

    const filterd = (
      selectedMember.remain_skills?.next_skill ?? []
    ).filter((skill) => skill.category === selectedCategory);
    setSelectedSkill(filterd[0] ?? null);
  }, [selectedCategory, selectedMember]);

  const addSuccess = async () => {
    const nextSuccess = success + 1;
    setSuccess(nextSuccess);

    if (nextSuccess >= 3) {
      const targetSkill =
        selectedCategory === "基礎"
          ? selectedMember.remain_skills?.basic_skill
          : selectedSkill;
      if (!targetSkill) {
        console.error("対象スキルが見つかりません");
        return;
      }
      const submitData = {
        user_id: selectedMember.id,
        success_score: 3,
        skill_id: targetSkill.id,
        earned_point: targetSkill.point,
      };
      console.log(submitData);

      try {
        await axios.get("./sanctum/csrf-cookie");
        await axios.post("./api/challenges", submitData);

        navigate("/challenge");
      } catch (error) {
        console.error("エラー", error);
      }
    }

    return setSuccess(nextSuccess);
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

  const handleChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
    setSuccess(0);
  };

  const handleChangeSkill = (e) => {
    const skillId = Number(e.target.value);
    const skill =
      (selectedMember?.remain_skills?.next_skill ?? []).find((skill) => skill.id === skillId);
    setSelectedSkill(skill ?? null);
    setSuccess(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      user_id: selectedMember.id,
      skill_id: selectedSkill?.id
        ? selectedSkill.id
        : selectedMember.current_level,
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

  if (!selectedMember) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.testContainer}>
      <h1>🔥レベルアップテスト🔥</h1>
      <div className={classes.challengeWrapper}>
        <div className={classes.selector}>
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
          <div className={classes.challengeSelector}>
            <h2>スキルタイプを選択する</h2>
            <select
              name="skillSlector"
              id="selector"
              onChange={handleChangeCategory}
              value={selectedCategory}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
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
          <div className={classes.challengeSkill}>
            {selectedCategory === "基礎" ? (
              selectedMember.current_level <= 25 ? (
                <p>{selectedSkill?.name?? "対象の技がありません"}</p>
              ) : (
                <p>基礎コースクリア済み！</p>
              )
            ) : (
              <select
                value={selectedSkill?.id ?? ""}
                onChange={handleChangeSkill}
              >
                {filteredSkills.map((skill) => (
                  <option value={skill.id} key={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            {selectedMember.current_level >= 26 && selectedCategory === "基礎"
              ? ""
              : [1, 2, 3].map((star) => (
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
        </div>{" "}
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
