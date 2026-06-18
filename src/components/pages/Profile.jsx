import React from "react";
import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import { Link } from "react-router-dom";
import classes from "./PageCommon.module.css";
import { fetchUser } from "../../api/user";
import { useState, useEffect } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(1).then((data) => {
      console.log(data);
      setUser(data.data);
    });
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.contentsWrapper}>
      <h1 style={{ textAlign: "center" }}>プロフィール</h1>
      <div className={classes.profileContainer}>
        <MemberCard
          member={user}
          showButton={false}
          success={user.success_score}
          level={user.current_level}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
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
