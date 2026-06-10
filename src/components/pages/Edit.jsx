import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import React from "react";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import { useState } from "react";
import classes from "./PageCommon.module.css";

const testUser = {
  id: 1,
  name: "よういち",
  level: 10,
  avatar: "./images/users/boy_1.png",
  receivedLikes: 3,
  nextSkill: "アリーナ100周",
  success:2,
};

const testAnimal = {
  id: 1,
  name: "ウサギ",
  avatar: "./images/animals/stand_rabbit.png",
};

const characters = [{
  id: 1,
  avatar_path: "./images/users/boy_1.png"
}, {
  id: 2,
  avatar_path: "./images/users/girl_3.png"
}];


function Edit() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>プロフィール変更</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MemberCard member={testUser} showButton={false} level={testUser.level} success={testUser.success}/>
        <AnimalCard animal={testAnimal} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "2rem auto",
          width: "10rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Button
            variant="primary"
            style={{ marginBottom: "1rem" }}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            イラストを変更する
          </Button>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ display: "flex", gap: "2rem" }}>
            {characters.map((character) => (
              <img
                src={character.avatar_path}
                style={{ width: "3rem" }}
                alt="avatar_image"
              />
            ))}{" "}
          </div>
        </Modal>
        <div className={classes.inputWrapper}>
          <label htmlFor="">なまえ</label>
          <input  type="text" value={testUser.name} />
          <label htmlFor="">パスワード変更</label>{" "}
          <input type="text" value="" />
          <label htmlFor="">パスワード確認</label>{" "}
          <input type="text" value="" />
        </div>
      </div>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <Button variant="primary">
          とうろく
        </Button>
      </div>
    </div>
  );
}

export default Edit;
