import { useEffect, useState } from "react";
import { fetchProfileActivity } from "../../api/profile";
import Loading from "../common/modal/Loading";
import classes from "./ProfileActivity.module.css";

type LikeUser = {
  id: number;
  name: string;
  avatar_path: string;
};

type ChallengeHistory = {
  id: number;
  skill_name: string;
  success_score: number;
  created_at: string;
  received_likes: number;
  like_users: LikeUser[];
};

type Activity = {
  id: string;
  type: "challenge" | "like_received" | "skill_tip";
  message: string;
  created_at: string;
};

type ActivityResponse = {
  days_since_last_challenge: number | null;
  activities: Activity[];
  challenges: ChallengeHistory[];
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
});

function LikeGivers({ users, count }: { users: LikeUser[]; count: number }) {
  return (
    <div className={classes.likeGivers}>
      <button type="button" className={classes.likeCount} aria-label={`いいね ${count}件`}>
        ❤ {count}
      </button>
      {users.length > 0 && (
        <div className={classes.likePopover} role="tooltip">
          {users.map((user) => (
            <div className={classes.liker} key={user.id}>
              <img src={user.avatar_path} alt="" />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileActivity() {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileActivity()
      .then(setData)
      .catch(() => setError("履歴を読み込めませんでした。"));
  }, []);

  if (!data && !error) return <Loading />;

  return (
    <section className={classes.wrapper} aria-labelledby="profile-history-title">
      <div className={classes.elapsedCard}>
        <span>チャレンジのペース</span>
        <strong>
          {!data
            ? "チャレンジ履歴を確認できません"
            : data.days_since_last_challenge === null
              ? "まだチャレンジはありません"
              : `前回のチャレンジから${data.days_since_last_challenge}日経過`}
        </strong>
      </div>

      {error ? (
        <p className={classes.error}>{error}</p>
      ) : (
        <div className={classes.columns}>
          <div className={classes.panel}>
            <h2 id="profile-history-title">チャレンジ履歴</h2>
            <div className={classes.scrollArea}>
              {data?.challenges.length ? data.challenges.map((challenge) => (
                <article className={classes.challengeRow} key={challenge.id}>
                  <time>{dateFormatter.format(new Date(challenge.created_at))}</time>
                  <div>
                    <strong>{challenge.skill_name}</strong>
                    <span>{challenge.success_score >= 3 ? "合格" : `${challenge.success_score}回成功`}</span>
                  </div>
                  <LikeGivers users={challenge.like_users} count={challenge.received_likes} />
                </article>
              )) : <p className={classes.empty}>まだ履歴がありません。</p>}
            </div>
          </div>

          <div className={classes.panel}>
            <h2>アクティビティ</h2>
            <div className={classes.scrollArea}>
              {data?.activities.length ? data.activities.map((activity) => (
                <article className={classes.activityRow} key={activity.id}>
                  <span className={classes.activityIcon} aria-hidden="true">
                    {activity.type === "like_received" ? "❤" : activity.type === "skill_tip" ? "💬" : "⭐"}
                  </span>
                  <div>
                    <p>{activity.message}</p>
                    <time>{dateFormatter.format(new Date(activity.created_at))}</time>
                  </div>
                </article>
              )) : <p className={classes.empty}>まだアクティビティがありません。</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfileActivity;
