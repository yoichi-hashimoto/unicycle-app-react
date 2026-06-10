import Button from "../common/button/Button";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <>
      <div className={classes.contentsWrapper}>
        {" "}
        <h1>一輪車アプリUni-Circleへようこそ！</h1>
        <h2>このアプリで出来ること</h2>
        <div className={classes.imgWrapper}>
          <div className={classes.commonContainer}>
            <h2>キャラクター設定</h2>
            <img src="./images/users/users_all.png"></img>
            <p>
              50種類以上のキャラクターイラストから自分の好きなアバターを選択できるよ。
            </p>
          </div>
          <div className={classes.commonContainer}>
            <h2>どうぶつとレベルアップ</h2>
            <img
              src="./images/animals/animals_home1.png"
              alt="animals_beginner"
            />
            <p>
              スキルをクリアするとレベルアップして、レベルに応じてどうぶつランクがつくよ。
            </p>
          </div>
          <div className={classes.commonContainer}>
            <h2>スキルにチャレンジ</h2>
            <img src="./images/history_like.png" alt="" />
            <p>全25個のスキルにチャレンジして3回成功するとレベルがあがるよ。</p>
            <p>チャレンジに❤を押して仲間をおうえんしよう！</p>
          </div>
        </div>
        <div className={classes.button}>
          <Button variant="primary">ログインしてはじめる</Button>
        </div>
      </div>
    </>
  );
};

export default Home;
