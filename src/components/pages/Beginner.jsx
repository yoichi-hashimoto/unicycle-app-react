import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { syncBeginnerProgress } from "../../api/beginner";
import {
  beginnerSteps,
  readBeginnerProgress,
  saveBeginnerProgress,
} from "../../features/beginner/beginnerProgress";
import { useAuthStore } from "../../stores/authStore";
import Button from "../common/button/Button";
import Loading from "../common/modal/Loading";
import classes from "./Beginner.module.css";

function Beginner() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [guestProgress, setGuestProgress] = useState(readBeginnerProgress);
  const step = user ? (user.beginner_mode ? user.beginner_step ?? 1 : 1) : guestProgress.step;
  const [isHatching, setIsHatching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const hatchTimer = useRef(null);
  const current = beginnerSteps[step - 1];
  const userId = user?.id;
  const userRole = user?.role;
  const accountBeginnerMode = user?.beginner_mode;

  useEffect(() => {
    setIsHatching(false);
    setIsSaving(false);
    setError("");
    return () => window.clearTimeout(hatchTimer.current);
  }, [userId]);

  useEffect(() => {
    if (isLoading || !userId || userRole === "gurdian" || accountBeginnerMode) return;
    let active = true;
    setIsSaving(true);
    syncBeginnerProgress({ enabled: true, step: 1 })
      .then((updatedUser) => {
        if (!active || useAuthStore.getState().user?.id !== userId) return;
        setIsSaving(false);
        setUser(updatedUser);
      })
      .catch(() => {
        if (!active) return;
        setIsSaving(false);
        setError("アカウントへの進捗保存に失敗しました。もう一度お試しください。");
      });
    return () => { active = false; };
  }, [accountBeginnerMode, isLoading, setUser, userId, userRole]);

  const handleComplete = () => {
    if (isHatching || isSaving || step >= beginnerSteps.length) return;

    setIsHatching(true);
    setError("");

    hatchTimer.current = window.setTimeout(async () => {
      const nextStep = Math.min(step + 1, beginnerSteps.length);
      if (!user) {
        setGuestProgress(saveBeginnerProgress(nextStep, true));
        setIsHatching(false);
        return;
      }

      try {
        const updatedUser = await syncBeginnerProgress({ enabled: true, step: nextStep });
        if (useAuthStore.getState().user?.id !== userId) return;
        setIsHatching(false);
        setUser(updatedUser);
      } catch {
        if (useAuthStore.getState().user?.id !== userId) return;
        setIsHatching(false);
        setError("アカウントへの進捗保存に失敗しました。もう一度お試しください。");
      }
    }, 700);
  };

  if (isLoading) return <Loading />;

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
          <Button variant="primary" onClick={handleComplete} disabled={isHatching || isSaving}>
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
