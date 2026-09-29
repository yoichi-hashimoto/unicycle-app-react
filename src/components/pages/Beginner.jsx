import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { syncBeginnerProgress } from "../../api/beginner";
import {
  beginnerSteps,
  readBeginnerProgress,
  saveBeginnerProgress,
} from "../../features/beginner/beginnerProgress";
import { useAuthStore } from "../../stores/authStore";
import Button from "../common/button/Button";
import classes from "./Beginner.module.css";

function Beginner() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const storedProgress = useMemo(() => readBeginnerProgress(), []);
  const initialStep = user?.beginner_mode
    ? Math.max(user.beginner_step ?? 1, storedProgress.step)
    : storedProgress.step;
  const [step, setStep] = useState(initialStep);
  const [isHatching, setIsHatching] = useState(false);
  const [error, setError] = useState("");
  const current = beginnerSteps[step - 1];
  const userId = user?.id;
  const userRole = user?.role;
  const accountBeginnerMode = user?.beginner_mode;
  const accountBeginnerStep = user?.beginner_step;

  useEffect(() => {
    const localProgress = readBeginnerProgress();
    const nextStep = accountBeginnerMode
      ? Math.max(accountBeginnerStep ?? 1, localProgress.step)
      : localProgress.step;
    setStep(nextStep);
    const progress = saveBeginnerProgress(nextStep, true);
    if (!userId || userRole === "gurdian") return;

    syncBeginnerProgress(progress)
      .then(setUser)
      .catch(() => setError("アカウントへの進捗保存に失敗しました。端末には保存されています。"));
  }, [accountBeginnerMode, accountBeginnerStep, setUser, userId, userRole]);

  const handleComplete = () => {
    if (isHatching || step >= beginnerSteps.length) return;

    setIsHatching(true);
    setError("");

    window.setTimeout(async () => {
      const nextStep = Math.min(step + 1, beginnerSteps.length);
      const progress = saveBeginnerProgress(nextStep, true);
      setStep(nextStep);
      setIsHatching(false);

      if (!user || user.role === "gurdian") return;

      try {
        const updatedUser = await syncBeginnerProgress(progress);
        setUser(updatedUser);
      } catch {
        setError("アカウントへの進捗保存に失敗しました。端末には保存されています。");
      }
    }, 700);
  };

  if (user?.role === "gurdian") {
    return (
      <div className={classes.page}>
        <h1>初心者コース</h1>
        <p>閲覧専用アカウントでは初心者コースの進捗を保存できません。</p>
        <Link to="/technical" className={classes.textLink}>わざ一覧を見る</Link>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <header className={classes.heading}>
        <p className={classes.eyebrow}>ログインなしでも使えます</p>
        <h1>はじめての一輪車コース</h1>
        <p>できたことを一つずつ記録して、たまごをひよこに育てよう！</p>
      </header>

      <div className={classes.progress} aria-label={`${step} / ${beginnerSteps.length}`}>
        {beginnerSteps.map((item) => (
          <span
            key={item.step}
            className={item.step <= step ? classes.progressDone : classes.progressPending}
          />
        ))}
      </div>

      <section className={classes.stageCard}>
        <p className={classes.stepLabel}>STEP {step} / {beginnerSteps.length}</p>
        <h2>{current.title}</h2>
        <div className={classes.imageFrame}>
          <img
            className={isHatching ? classes.shake : ""}
            src={current.image}
            alt={current.title}
          />
        </div>
        <div className={classes.taskBox}>
          <span>今回の目標</span>
          <p>{current.task}</p>
        </div>

        {step < beginnerSteps.length ? (
          <Button variant="primary" onClick={handleComplete} disabled={isHatching}>
            {isHatching ? "たまごが動いています…" : "出来た"}
          </Button>
        ) : (
          <div className={classes.completeActions}>
            <strong>🎉 レベル1になりました！</strong>
            {user ? (
              <Link to="/profile" className={classes.textLink}>プロフィールを見る</Link>
            ) : (
              <Link to="/login" className={classes.textLink}>ログインして進捗を引き継ぐ</Link>
            )}
          </div>
        )}
      </section>

      {!user && step < beginnerSteps.length && (
        <p className={classes.saveNote}>
          この端末に自動保存中です。<Link to="/login">ログイン</Link>するとアカウントへ引き継げます。
        </p>
      )}
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
}

export default Beginner;
