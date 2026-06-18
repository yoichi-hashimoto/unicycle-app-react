import HistoryCard from "../common/cards/HistoryCard";
import classes from "./PageCommon.module.css";
import { useState, useEffect } from "react";
import { fetchChallenges } from "../../api/challenges";
import ScrollToTop from "../common/button/ScrollButton";

function Challenge({ showButton = true }) {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    fetchChallenges().then((challenges) => {
      console.log(challenges);
      setChallenges(challenges);
    });
  }, []);

  return (
    <div className={classes.contentsWrapper}>
      <h1>みんなのチャレンジ</h1>
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
