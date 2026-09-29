export const BEGINNER_STORAGE_KEY = "unicircle.beginnerProgress";

export const beginnerSteps = [
  {
    step: 1,
    title: "まずは、またがってみよう",
    task: "一輪車にまたがって、壁を使いながら10秒安定する",
    image: "/images/animals/beginner/stage-01-egg.webp",
  },
  {
    step: 2,
    title: "小さなヒビが入ったよ",
    task: "壁伝いに10m進む",
    image: "/images/animals/beginner/stage-02-small-crack.webp",
  },
  {
    step: 3,
    title: "もうすぐ生まれそう！",
    task: "補助付きで10m進む",
    image: "/images/animals/beginner/stage-03-large-crack.webp",
  },
  {
    step: 4,
    title: "ひよこが顔を出したよ",
    task: "補助なしで5こぎできる",
    image: "/images/animals/beginner/stage-04-peeking.webp",
  },
  {
    step: 5,
    title: "あと少しで誕生！",
    task: "補助なしで10こぎできる",
    image: "/images/animals/beginner/stage-05-limbs.webp",
  },
  {
    step: 6,
    title: "ひよこに進化しました！",
    task: "初心者コースクリア。レベル1から次の技に挑戦しよう！",
    image: "/images/animals/stand_chick.webp",
  },
];

export function readBeginnerProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(BEGINNER_STORAGE_KEY));
    const step = Number(stored?.step);

    return {
      enabled: stored?.enabled === true,
      step: Number.isInteger(step) && step >= 1 && step <= 6 ? step : 1,
    };
  } catch {
    return { enabled: false, step: 1 };
  }
}

export function saveBeginnerProgress(step, enabled = true) {
  const progress = {
    enabled,
    step: Math.min(6, Math.max(1, Number(step) || 1)),
  };
  localStorage.setItem(BEGINNER_STORAGE_KEY, JSON.stringify(progress));
  return progress;
}
