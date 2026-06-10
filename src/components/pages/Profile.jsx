import React from "react";
import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import Button from "../common/button/Button";
import { Link } from "react-router-dom";
import classes from "./PageCommon.module.css";

const testUser = {
  id: 1,
  name: "よういち",
  level: 10,
  avatar: "./images/users/boy_1.png",
  receivedLikes: 0,
  animalAvatar: "./images/animals/stand_chick.png",
  success: 2,
  nextSkill: "アリーナ100周",
};

const testAnimal = {
  id: 1,
  name: "ウサギ",
  avatar: "./images/animals/stand_chick.png",
};

function Profile() {
  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>プロフィール</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MemberCard member={testUser} showButton={false} success={testUser.success} level={testUser.level} />
        <AnimalCard animal={testAnimal} />
      </div>
      <div style={{ textAlign: "center", margin: "3rem" }}>
          <Link to="/edit" className={classes.linkButton}>プロフィールを変更する</Link>
      </div>
    </div>
  );
}

export default Profile;
