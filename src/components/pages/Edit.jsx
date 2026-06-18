import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import React from "react";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import { useState, useEffect } from "react";
import classes from "./PageCommon.module.css";
import { fetchUser } from "../../api/user";
import { fetchAvatars } from "../../api/avatars";
import { useNavigate } from "react-router-dom";

const colors = [
  {
    id: 1,
    name: "white",
  },
  {
    id: 2,
    name: "yellow",
  },
  {
    id: 3,
    name: "blue",
  },
];

function Edit() {
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(4).then((data) => {
      console.log(data);
      setUser(data.data);
    });
  }, []);

  const [userImage, setUserImage] = useState();
  const avatarChange = (avatar) => {
    setUserImage(avatar.avatar_path);
    setFormData((prev) => ({
      ...prev,
      user_avatar_id: avatar.id,
    }));
    setIsOpen(false);
  };

  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    fetchAvatars().then((data) => {
      console.log(data);
      setAvatars(data);
    });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    user_avatar_id: "",
    background_color: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("送信前formData", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/4", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }
      const result = await response.json();
      console.log("送信成功:", result);
      setUser((prev) => ({
        ...prev,
        ...result.data,
      }));
      setFormData((prev) => ({
        ...prev,
        name: result.data.name || "",
        user_avatar_id: result.data.user_avatar_id || "",
        background_color: result.data.background_color || "",
      }));
      navigate("/profile");
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  if (!avatars) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.contentsWrapper}>
      <h1>プロフィール変更</h1>
      <div className={classes.editContainer}>
        <MemberCard
          member={{ ...user, avatar_path: userImage || user.avatar_path }}
          showButton={false}
          level={user.current_level}
          success={user?.success_score}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
        />
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.buttonWrapper}>
          <Button
            variant="primary"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            アバターを変更する
          </Button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className={classes.avatarSelector}>
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className={classes.avatarButton}
                  name="user_avatar_id"
                  value={avatar.id}
                  onClick={() => avatarChange(avatar)}
                >
                  <img
                    src={avatar.avatar_path}
                    className={classes.avatarImg}
                    alt="avatar_image"
                    key={avatar.id}
                  />
                </button>
              ))}{" "}
            </div>
          </Modal>
          <Button variant="primary" onClick={() => setIsColorOpen(true)}>
            背景を選択する
          </Button>
          <Modal
            isColorOpen={isColorOpen}
            onClose={() => {
              setIsColorOpen(false);
            }}
          >
            <div>
              {colors.map((color) => (
                <button key={color.id} className={classes[color.name]}></button>
              ))}
            </div>
          </Modal>
        </div>
        <div className={classes.inputWrapper}>
          <label htmlFor="">なまえ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder={user.name}
            onChange={handleChange}
          />
          <label htmlFor="">今のパスワード</label>{" "}
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
          />
          <label htmlFor="">パスワード変更</label>{" "}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="">パスワード確認</label>{" "}
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Button variant="primary" onClick={handleSubmit}>
            とうろく
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Edit;
