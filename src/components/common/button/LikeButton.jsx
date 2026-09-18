import axios from "../../../api/axios";
import { useState, useEffect } from "react";
import classes from "./LikeButton.module.css";
import Toast from "../modal/Toast";

function LikeButton({ likeHistory, showButton = true, fromUser }) {
  const [isLiked, setIsLiked] = useState(false);
  const [liked, setLiked] = useState(0);
  const [toast, setToast] = useState(false);

  function showToast(message, type = 'fail') {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
      });
    }, 2500);
  }

  useEffect(() => {
    setIsLiked(likeHistory?.is_liked_by_me ?? false);
    setLiked(likeHistory?.received_likes ?? 0);
  }, [likeHistory]);

  const handleLike = async (e) => {
    e.preventDefault();

    if (isLiked) return;

    const data = {
      user_id: likeHistory.user_id,
      from_user_id: fromUser?.id ?? fromUser,
      challenge_id: likeHistory.id,
    };
    console.log(data);

    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(`/api/likes`, data);
      setIsLiked(true);
      setLiked((prev) => prev + 1);
    } catch (error) {
      console.error("エラーです", error.response?.data ?? error);
      showToast("ログインしてください", "fail");
    }
  };

  return (
    <div>
      {" "}
      {toast.message &&
        <div>
          <Toast type={toast.type} message={toast.message} />
        </div>}
      <div className={classes.likeContainer}>
        <div className={classes.receivedLikesContainer}>
          {isLiked ? (
            <span
              className={`${classes.heart} ${isLiked ? classes.bounce : ""}`}
            >
              ❤
            </span>
          ) : (
            <span className={classes.unlike}>&#9825;</span>
          )}
          <p className={classes.numberOfLiked}>{liked}</p>
        </div>
        {showButton && (
          <button onClick={handleLike} className={classes.likeButton}>
            {isLiked ? "❤済み" : "❤を押す"}
          </button>
        )}
      </div>
    </div>
  );
}

export default LikeButton;
