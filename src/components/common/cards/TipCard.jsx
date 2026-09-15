import classes from "./TipCard.module.css";

function TipCard({ skillTips }) {
  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format;

  return (
    <div>
      {skillTips.map((tip) => (
          <div className={classes.tipsContainer} key={tip.id}>
            <div>
              <img src={tip.user.avatar.avatar_path} alt={tip.user.name} />
              <p>{tip.user.name}</p>
            </div>
            <div className={classes.tipsText}>
              <p>---{formattedDate(new Date(tip.created_at))}---</p>
              <p>{tip.text}</p>
            </div>
          </div>
      ))}
    </div>
  );
}

export default TipCard;
