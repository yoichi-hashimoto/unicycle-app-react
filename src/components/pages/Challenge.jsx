import HistoryCard from "../common/cards/HistoryCard";
import classes from "./PageCommon.module.css";
import { useState, useEffect } from "react";
import { fetchChallenges } from "../../api/challenges";
import ScrollToTop from "../common/button/ScrollButton";
import Button from "../common/button/Button";
import Loading from "../common/modal/Loading";

function Challenge({ showButton = true }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortByLevel = () => {
    const sortedChallenge = [...challenges].sort(
      (a, b) => b.current_level - a.current_level,
    );
    setChallenges(sortedChallenge);
  };
  const sortByLike = () => {
    const likedChallenge = [...challenges].sort(
      (a, b) => b.received_likes - a.received_likes,
    );
    setChallenges(likedChallenge);
  };
  const sortByDate = () => {
    const youngerChallenge = [...challenges].sort(
      (a, b) => new Date(b.created_at) - new Date( a.created_at),
    );
    setChallenges(youngerChallenge);
  };
  useEffect(() => {
    async function loadChallenges() {
      try {
        setLoading(true);
        const challenges = await fetchChallenges();
        setChallenges(challenges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  return (
    <div className={classes.contentsWrapper}>
      <h1>みんなのチャレンジ</h1>
      
      {loading && <Loading/>}
      <div className={classes.sortbuttonWrapper}>
        <Button variant="outline" onClick={sortByDate}>
          新しい順
        </Button>
        <Button onClick={sortByLevel} variant="outline" color="primary">
          レベル順
        </Button>
        <Button onClick={sortByLike} variant="outline">
          ❤の数順
        </Button>
      </div>
      <p style={{textAlign:"center",color:"red"}}>❤を押すにはログインしてください</p>
      <div className={classes.challengeContainer}>
        {challenges.map((challenge) => (
          <HistoryCard key={challenge.id} history={challenge} />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Challenge;
