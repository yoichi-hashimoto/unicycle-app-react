import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import React from "react";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import { useState, useEffect } from "react";
import classes from "./PageCommon.module.css";
import { fetchAvatars } from "../../api/avatars";
import { fetchColors } from "../../api/color";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import axios from "../../api/axios";
import Toast from "../common/modal/Toast";
import Loading from "../common/modal/Loading";

function Edit() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState();
  const [userColor, setUserColor] = useState();
  const [avatars, setAvatars] = useState([]);
  const [colors, setColors] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  function showToast(message, type = "error") {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 2500);
  }


  const [formData, setFormData] = useState({
    name: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    user_avatar_id: "",
    color_id: "",
  });

  useEffect(() => {
    async function loadAvatars() {
      try {
        setIsLoading(true);
        const allAvatars = await fetchAvatars();
        setAvatars(allAvatars);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAvatars();
  }, []);

  useEffect(() => {
    fetchColors().then((data) => {
      setColors(data);
    });
  }, []);

  
  useEffect(() => {
    if (user?.user_items) {
      setUserItems(user.user_items);
    }
  }, [user]);


  if (!user) {
    return <Toast>ログインしてください</Toast>;
  }

  const avatarChange = (avatar) => {
    setUserImage(avatar.avatar_path);
    setFormData((prev) => ({
      ...prev,
      user_avatar_id: avatar.id,
    }));
    setIsOpen(false);
  };

  const colorChange = (color) => {
    setUserColor(color.color_path);
    setFormData((prev) => ({
      ...prev,
      color_id: color.id,
    }));
    setIsColorOpen(false);
  };

  const handleEquipItem = async (userItemId) => {
    try {
          setIsLoading(true);
      const response = await axios.patch(`/api/user_item/${userItemId}`) 
      setUser({
        ...user,
        equipped_item_path: response.data.user_item.item.avatar_path,
      });
    } catch (error) {
      console.error(error);
      setToast({
        message: "アイテムの変更に失敗しました",
        type:"error",
      })
    } finally {
      setIsLoading(false);
    }
    setIsItemOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.patch(`/api/users/${user.id}`, formData);
      const result = response.data;

      setUser(result.data);

      showToast("更新しました", "success");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.contentsWrapper}>
      {isLoading && <Loading />}
      <h1>プロフィール変更</h1>
      <div className={classes.editContainer}>
        <MemberCard
          member={{
            ...user,
            avatar_path: userImage || user.avatar_path,
            color_path: userColor || user.color_path,
          }}
          showButton={false}
          level={user.current_level}
          success={user?.success_score}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
          currentLevel={user.current_level}
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
              ))}
            </div>
          </Modal>
          <Button variant="primary" onClick={() => setIsColorOpen(true)}>
            背景を選択する
          </Button>
          <Modal
            isOpen={isColorOpen}
            onClose={() => {
              setIsColorOpen(false);
            }}
          >
            <div className={classes.colorContainer}>
              {colors.map((color) => (
                <div className={classes.colors} key={color.id}>
                  <button
                    name="color_id"
                    value={color.id}
                    style={{ backgroundColor: color.color_path }}
                    className={classes.bgColors}
                    onClick={() => colorChange(color)}
                  ></button>
                  <p>{color.name}</p>
                </div>
              ))}
            </div>
          </Modal>
          <Button variant="primary" onClick={() => setIsItemOpen(true)}>
            アイテムを変更する
          </Button>
          <Modal
            isOpen={isItemOpen}
            onClose={() => {
              setIsItemOpen(false);
            }}
          >
            <div className={classes.itemModalContainer}>
              {userItems.map((userItem) => (
                <div className={classes.itemContainer} key={userItem.id}>
                  <button
                    key={userItem.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleEquipItem(userItem.id)}
                    className={classes.usersItems}
                  >
                    <img src={userItem.item.avatar_path} alt="" className={classes.itemsImage} />
                  </button>
                  <p>{userItem.item.name}</p>
                </div>
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
        <div className={classes.toastWrapper}>
          <Toast message={toast.message} type={toast.type} />
        </div>
      </div>
    </div>
  );
}

export default Edit;
