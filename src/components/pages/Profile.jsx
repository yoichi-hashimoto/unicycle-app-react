import React from "react";
import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import { Link } from "react-router-dom";
import classes from "./PageCommon.module.css";
import { useAuthStore } from "../../stores/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUSer);

  if(!user)
  { return <p>読み込み中</p>; }

  return (
    <div className={classes.contentsWrapper}>
      <h1 style={{ textAlign: "center" }}>プロフィール</h1>
      <div className={classes.profileContainer}>
        <MemberCard
          member={ user }
          showButton={false}
          success={user.success_score}
          level={user.current_level}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
          currentLevel={user.current_level}
        />
      </div>
      <div style={{ textAlign: "center", margin: "3rem" }}>
        <Link to="/edit" className={classes.linkButton}>
          プロフィールを変更する
        </Link>
      </div>
    </div>
  );
}

export default Profile;
