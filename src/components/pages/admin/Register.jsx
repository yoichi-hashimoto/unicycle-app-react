import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import { useState } from "react";
import classes from "./Register.module.css";

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

const characters = [
  {
    id: 1,
    avatar_path: "./images/users/boy_1.png",
  },
  {
    id: 2,
    avatar_path: "./images/users/girl_3.png",
  },
];

function Register() {
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const registerConfirmation = () => {
    return window.confirm("本当に登録しますか？");
    console.log("登録完了です");
  }

  return (
    <div className={classes.registerContainer}>
      <h2>新規登録</h2>
      <label htmlFor="">
        なまえ
        <input type="text" placeholder="6文字以内でなまえを入力してください" />
      </label>
      <label htmlFor="">
        パスワード
        <input
          type="text"
          placeholder="パスワードを6文字以上で入力してください"
        />
      </label>
      <label htmlFor="">
        パスワード確認
        <input
          type="text"
          placeholder="パスワードを6文字以上で入力してください"
        />
      </label>
      <Button
        variant="primary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        イラストを選択
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div>
          {characters.map((character) => (
            <img key={character.id} src={character.avatar_path} />
          ))}
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
      <Button variant="primary" onClick={registerConfirmation}>登録する</Button>
    </div>
  );
}

export default Register;
