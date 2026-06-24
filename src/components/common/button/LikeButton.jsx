import axios from "axios";
import { useState,useEffect } from "react";
import classes from "./LikeButton.module.css";

function LikeButton({ likeHistory, showButton = true, fromUser }) {
  const [isLiked, setIsLiked] = useState(false);
  const [liked, setLiked] = useState(0);

  useEffect(()=>{
  setIsLiked(likeHistory?.is_liked_by_me ?? false);
  //いいねボタン1回を判断する箱
  setLiked(likeHistory?.received_likes ?? 0);},[likeHistory]);
  //いいねボタンの数字の箱、初期値はrecived_likesで親のchallenge->history->likeHistoryでもらう

  const handleLike = async (e) => {
    e.preventDefault();

    if(isLiked)return;
    
    const data = {
      user_id: likeHistory.user_id,
      from_user_id: fromUser?.id ?? fromUser,
      challenge_id: likeHistory.id,
    };      console.log(data);

    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(`/api/likes`, data);
      setIsLiked(true);
      setLiked((prev) => prev + 1);
    } catch (error) {
      console.error("エラーです", error.response?.data ?? error);
    }
  };
  //apiへのデータ送信 user_id,from_user_id,challenge_idを送りたい。
  //データの定義,user_idはhistoryから引っ張る。history.user_idでとれる、history.challenge_id、from_userはzustandからとる
  //apiへデータを送る、cookieを取得してlocalhost:8000へpostする
  //catchでエラー時のメッセージをconsole.logに出す
  return (
    <div>
      <div className={classes.likeContainer}>
        <div className={classes.receivedLikesContainer}>
          {isLiked ? (
            <span className={`${classes.heart} ${isLiked ? classes.bounce:""}`}>❤</span>
          ) : (
            <span className={classes.unlike}>&#9825;</span>
          )}
          <p>{liked}</p>
        </div>
        {showButton && (
          <button onClick={handleLike} className={classes.likeButton} >
            {isLiked ? "❤済み" : "❤を押す"}
          </button>
        )}
      </div>
    </div>
  );
}

export default LikeButton;
