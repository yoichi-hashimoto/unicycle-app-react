import Button from "../common/button/Button";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";
import { fetchNotice } from "../../api/notice";
import { useState, useEffect } from "react";
import NoticeCard from "../common/cards/NoticeCard";

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const slides = [
    {
      title: "キャラクター設定",
      image: "./images/users/users_all.png",
      text: "50種類以上のキャラクターイラストから自分の好きなアバターを選択できるよ。",
    },
    {
      title: "スキルにチャレンジ",
      image: "./images/skill_test.png",
      text: "スキルにチャレンジして3回成功するとレベルがあがるよ。チャレンジに❤を押して仲間をおうえんしよう！",
    },
    {
      title: "どうぶつとレベルアップ",
      image: "./images/animals/animal_circle.png",
      text: "スキルをクリアすると、レベルに応じてどうぶつランクがつくよ。ポイントのもらえるスキルに挑戦してアイテムを手にいれよう！",
    },
  ];

  useEffect(() => {
    async function loadNotice() {
      try {
        const recentNotices = await fetchNotice();
        setNotices(recentNotices)
      } catch (error) {
        console.error(error); 
      } finally {
        console.log(loadNotice);
      }
    }
    loadNotice();
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
        setIsVisible(true);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={classes.contentsWrapper}>
        {" "}
        <h1>一輪車アプリUni-Circleへようこそ！</h1>
          <NoticeCard notices={notices}/>
        <div className={classes.imgContainer}>
          <div className={classes.imgWrapper}>
            <div className={`${classes.commonContainer} ${isVisible ? classes.fadeIn : classes.fadeOut}`}>
              <h2>{slides[currentSlide].title}</h2>
              <img src={slides[currentSlide].image} alt="slide"></img>
              <p>
                { slides[currentSlide].text }
              </p>
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
