import Button from "../common/button/Button";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";

const notices = [
  {
    date: "2026-06-25",
    isNew: true,
    text: "新アイテム「ふえ」が追加されました！",
  },
  {
    date: "2026-03-24",
    isNew: false,
    text: "お試し",
  },
];

const Home = () => {
  return (
    <>
      <div className={classes.contentsWrapper}>
        {" "}
        <h1>一輪車アプリUni-Circleへようこそ！</h1>
        <div className={classes.noticeContainer}>
          <div className={classes.noticeTitle}>
            <h2>お知らせ</h2>
          </div>
          <span className={classes.line}></span>
          {notices.map((notice) => (
            <div className={classes.noticeItem}>
              <div className={classes.dateGroup}>
                {notice.isNew && <span className={classes.new}>NEW!</span>}
                <p>{notice.date}</p>
              </div>
              <div className={classes.noticeText}> {notice.text}</div>
            </div>
          ))}
        </div>
        <div className={classes.imgContainer}>
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
                スキルをクリアするとレベルアップして、レベルに応じてどうぶつランクがつくよ。わざに合格すると秘密のアイテムも手にはいるよ！
              </p>
            </div>
            <div className={classes.commonContainer}>
              <h2>スキルにチャレンジ</h2>
              <img src="./images/history_like.png" alt="" />
              <p>
                全25個のスキルにチャレンジして3回成功するとレベルがあがるよ。
              </p>
              <p>チャレンジに❤を押して仲間をおうえんしよう！</p>
            </div>
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
                スキルをクリアするとレベルアップして、レベルに応じてどうぶつランクがつくよ。わざに合格すると秘密のアイテムも手にはいるよ！
              </p>
            </div>
            <div className={classes.commonContainer}>
              <h2>スキルにチャレンジ</h2>
              <img src="./images/history_like.png" alt="" />
              <p>
                全25個のスキルにチャレンジして3回成功するとレベルがあがるよ。
              </p>
              <p>チャレンジに❤を押して仲間をおうえんしよう！</p>
            </div>
          </div>
        </div>
        <div className={classes.button}>
          <Button variant="primary">
            <Link className={classes.linkButton} to="./login">
              ログインしてはじめる
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
