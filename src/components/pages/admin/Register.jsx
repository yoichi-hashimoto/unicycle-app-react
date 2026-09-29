import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import { useState, useEffect } from "react";
import classes from "./Register.module.css";
import { fetchColors } from "../../../api/color";
import { fetchAvatars } from "../../../api/avatars";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { getBackgroundStyle } from "../../../utils/background";

const defaultAvatar = "/images/users/avatar_01_r1_c1.png";

function Register() {
  const [avatars, setAvatars] = useState([]);
  const [colors, setColors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    password_confirmation: "",
    user_avatar_id: 1,
    color_id: 1,
    login_id:"",
    role: "member",
  });
  const [userImg, setUserImg] = useState(defaultAvatar);
  const [colorImg, setColorImg] = useState("#FFFFFF");
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvatars().then((data) => {
      console.log(data);
      setAvatars(data);
    });
  }, []);

  useEffect(() => {
    fetchColors().then((data) => {
      console.log(data);
      setColors(data);
    });
  }, []);

  const avatarChange = (avatar) => {
    setUserImg(avatar.avatar_path);
    setFormData((prev) => ({
      ...prev,
      user_avatar_id: avatar.id,
    }));
    setIsOpen(false);
  };

  const colorChange = (color) => {
    setColorImg(color.color_path);
    console.log(colorImg);
    setFormData((prev) => ({
      ...prev,
      color_id: color.id,
    }));
    setIsColorOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("送信前：", formData);
    if (!window.confirm("本当に登録しますか？")) return;

    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(`/api/users`, formData);
      navigate("/ranking");
    } catch (error) {
      console.error("エラー：", error);
    }
  };

  return (
    <div className={classes.registerContainer}>
      <h2>新規登録</h2>
      {formData.role !== "gurdian" && (
        <img
          src={userImg || defaultAvatar}
          alt=""
          style={getBackgroundStyle(colorImg)}
          className={classes.avatarPreview}
        />
      )}
      <label htmlFor="role">
        権限
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="member">メンバー</option>
          <option value="admin">管理者</option>
          <option value="gurdian">閲覧者（gurdian）</option>
        </select>
      </label>
      <label htmlFor="">
        なまえ
        <input
          type="text"
          placeholder="6文字以内でなまえを入力してください"
          value={formData.name}
          onChange={handleChange}
          name="name"
        />
      </label>
      <label htmlFor="">
        ログインID
        <input
          type="text"
          name="login_id"
          placeholder="ログインIDを設定してください 例)OUC0000"
          value={formData.login_id}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="">
        パスワード
        <input
          type="password"
          name="password"
          placeholder="パスワードを6文字以上で入力してください"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="">
        パスワード確認
        <input
          type="password"
          name="password_confirmation"
          placeholder="パスワードを6文字以上で入力してください"
          value={formData.password_confirmation}
          onChange={handleChange}
        />
      </label>
      {formData.role !== "gurdian" && <Button
        variant="primary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        イラストを選択
      </Button>}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div>
          {avatars.map((avatar) => (
            <button
              className={classes.avatarButton}
              onClick={() => avatarChange(avatar)}
            >
              {" "}
              <img
                alt=""
                key={avatar.id}
                src={avatar.avatar_path}
                className={classes.avatarImg}
              />
            </button>
          ))}
        </div>
      </Modal>

      {formData.role !== "gurdian" && <Button variant="primary" onClick={() => setIsColorOpen(true)}>
        背景を選択する
      </Button>}
      <Modal
        isOpen={isColorOpen}
        onClose={() => {
          setIsColorOpen(false);
        }}
      >
        <div className={classes.colorContainer}>
          <div className={classes.colors}>
            {colors.map((color) => (
              <div>
                <button
                  key={color.id}
                  style={getBackgroundStyle(color.color_path)}
                  className={classes.bgColors}
                  onClick={() => colorChange(color)}
                ></button>
                <p>{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Button variant="primary" onClick={handleSubmit}>
        登録する
      </Button>
    </div>
  );
}

export default Register;
