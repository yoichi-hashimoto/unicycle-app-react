import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { fetchLoginUser } from "./api/auth";
import { syncBeginnerProgress } from "./api/beginner";
import { beginnerSteps, readBeginnerProgress, saveBeginnerProgress } from "./features/beginner/beginnerProgress";
import { useAuthStore } from "./stores/authStore";
import axios from "./api/axios";
import { fetchItems } from "./api/items";
import { fetchProfileActivity } from "./api/profile";
import { fetchNotice } from "./api/notice";
import { fetchAvatars } from "./api/avatars";
import { fetchColors } from "./api/color";

jest.mock("./api/axios", () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  patch: jest.fn().mockResolvedValue({}),
}));
jest.mock("./api/auth", () => ({ fetchLoginUser: jest.fn() }));
jest.mock("./api/beginner", () => ({ syncBeginnerProgress: jest.fn() }));
jest.mock("./api/items", () => ({ fetchItems: jest.fn().mockResolvedValue([]) }));
jest.mock("./api/profile", () => ({
  fetchProfileActivity: jest.fn().mockResolvedValue({ activities: [], challenges: [], days_since_last_challenge: null }),
}));
jest.mock("./api/notice", () => ({ fetchNotice: jest.fn().mockResolvedValue([]) }));
jest.mock("./api/avatars", () => ({ fetchAvatars: jest.fn().mockResolvedValue([]) }));
jest.mock("./api/color", () => ({ fetchColors: jest.fn().mockResolvedValue([]) }));

const legacyKey = "unicircle.beginnerProgress";
let serverUser;

function userAt(step = 1, overrides = {}) {
  const chick = { id: 1, name: "ひよこ", avatar_path: "/images/animals/stand_chick.webp", avatar_path_walk: "/images/animals/stand_chick.webp" };
  return {
    id: 3, name: "ローカル初心者", role: "member", beginner_mode: true,
    beginner_step: step, current_level: 1, current_animal: chick,
    display_animal: step < 6
      ? { name: "たまご", avatar_path: `/images/animals/beginner/stage-0${step}-egg.webp` }
      : chick,
    user_items: [], remain_level: 5,
    ...overrides,
  };
}

async function mountAt(path, authenticated = true) {
  window.history.replaceState({}, "", path);
  fetchLoginUser.mockImplementation(() => authenticated
    ? Promise.resolve(serverUser)
    : Promise.reject(new Error("Not signed in")));
  let view;
  await act(async () => { view = render(<App />); });
  return view;
}

async function login(view) {
  fetchLoginUser.mockImplementation(async () => serverUser);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "BEGINNER001" } });
  fireEvent.change(view.container.querySelector('input[name="password"]'), { target: { value: "LocalTest123!" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ログインする" })); });
  await act(async () => { jest.advanceTimersByTime(1500); });
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  localStorage.clear();
  useAuthStore.setState({ user: null, isLoggedIn: false, isLoading: true });
  serverUser = userAt();
  axios.get.mockResolvedValue({});
  axios.post.mockResolvedValue({});
  axios.patch.mockResolvedValue({});
  fetchItems.mockResolvedValue([]);
  fetchProfileActivity.mockResolvedValue({ activities: [], challenges: [], days_since_last_challenge: null });
  fetchNotice.mockResolvedValue([]);
  fetchAvatars.mockResolvedValue([]);
  fetchColors.mockResolvedValue([]);
  syncBeginnerProgress.mockImplementation(async ({ enabled, step }) => {
    const nextStep = enabled ? Math.max(serverUser.beginner_step, step) : 1;
    serverUser = userAt(nextStep, { ...serverUser, beginner_mode: enabled, beginner_step: nextStep,
      display_animal: nextStep < 6
        ? { name: "たまご", avatar_path: `/images/animals/beginner/stage-0${nextStep}-egg.webp` }
        : serverUser.current_animal,
    });
    return serverUser;
  });
});

afterEach(() => { jest.useRealTimers(); });

test("完了済みの端末データがあっても初心者のログイン後は卵のまま", async () => {
  localStorage.setItem(legacyKey, JSON.stringify({ enabled: true, step: 6 }));
  const view = await mountAt("/login", false);
  await login(view);
  expect(useAuthStore.getState().user.beginner_step).toBe(1);
  expect(screen.getByAltText("たまご ステップ1")).toBeInTheDocument();
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("初心者コースを開くだけでは別の端末進捗で孵化しない", async () => {
  localStorage.setItem(legacyKey, JSON.stringify({ enabled: true, step: 6 }));
  await mountAt("/beginner");
  expect(screen.getByText("STEP 1 / 6")).toBeInTheDocument();
  expect(screen.getByAltText("まずは、またがってみよう")).toBeInTheDocument();
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("認証確認中に初心者コースを再読込してもゲスト進捗をアカウントに送らない", async () => {
  localStorage.setItem(legacyKey, JSON.stringify({ enabled: true, step: 6 }));
  let resolveUser;
  fetchLoginUser.mockImplementation(() => new Promise(resolve => { resolveUser = resolve; }));
  window.history.replaceState({}, "", "/beginner");
  render(<App />);
  expect(screen.queryByRole("button", { name: "出来た" })).not.toBeInTheDocument();
  await act(async () => { resolveUser(serverUser); });
  expect(screen.getByText("STEP 1 / 6")).toBeInTheDocument();
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("新しいゲストの進捗も既存初心者のログインでは上書きしない", async () => {
  saveBeginnerProgress(6);
  const view = await mountAt("/login", false);
  await login(view);
  expect(useAuthStore.getState().user.beginner_step).toBe(1);
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("出来たを5回押すと卵から順に進み、最後だけひよこになる", async () => {
  await mountAt("/beginner");
  for (let step = 1; step < 6; step += 1) {
    expect(screen.getByText(`STEP ${step} / 6`)).toBeInTheDocument();
    if (step < 6) expect(serverUser.display_animal.name).toBe("たまご");
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "出来た" })); });
    await act(async () => { jest.advanceTimersByTime(700); });
    expect(serverUser.beginner_step).toBe(step + 1);
  }
  expect(screen.getByText("STEP 6 / 6")).toBeInTheDocument();
  expect(screen.getByAltText("ひよこに進化しました！")).toHaveAttribute("src", "/images/animals/stand_chick.webp");
  expect(syncBeginnerProgress).toHaveBeenCalledTimes(5);
  await act(async () => { fireEvent.click(screen.getByRole("link", { name: "プロフィールを見る" })); });
  expect(screen.getByRole("heading", { name: "ひよこ" })).toBeInTheDocument();
});

test("進捗保存に失敗したら次のステップへ進まない", async () => {
  await mountAt("/beginner");
  syncBeginnerProgress.mockRejectedValueOnce(new Error("Network error"));
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "出来た" })); });
  await act(async () => { jest.advanceTimersByTime(700); });
  expect(screen.getByText("STEP 1 / 6")).toBeInTheDocument();
  expect(useAuthStore.getState().user.beginner_step).toBe(1);
  expect(screen.getByText(/保存に失敗/)).toBeInTheDocument();
});

test("ログアウトして別アカウントに入っても進捗が混ざらない", async () => {
  serverUser = userAt(6);
  await mountAt("/beginner");
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ログアウト" })); });
  serverUser = userAt(1, { id: 4, name: "別の初心者" });
  const view = { container: document.body };
  await login(view);
  expect(screen.getByAltText("たまご ステップ1")).toBeInTheDocument();
  expect(useAuthStore.getState().user.id).toBe(4);
});

test("初心者コースを再読込するとアカウントに保存した途中から再開する", async () => {
  serverUser = userAt(3);
  localStorage.setItem(legacyKey, JSON.stringify({ enabled: true, step: 6 }));
  const view = await mountAt("/beginner");
  expect(screen.getByText("STEP 3 / 6")).toBeInTheDocument();
  view.unmount();
  useAuthStore.setState({ user: null, isLoggedIn: false, isLoading: true });
  await mountAt("/beginner");
  expect(screen.getByText("STEP 3 / 6")).toBeInTheDocument();
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("ゲスト進捗は新しく始めるアカウントに一度だけ引き継ぐ", async () => {
  saveBeginnerProgress(4);
  serverUser = userAt(1, { id: 10, beginner_mode: false });
  const view = await mountAt("/login", false);
  await login(view);
  expect(useAuthStore.getState().user.beginner_step).toBe(4);
  expect(syncBeginnerProgress).toHaveBeenCalledTimes(1);
  expect(readBeginnerProgress().enabled).toBe(false);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ログアウト" })); });
  serverUser = userAt(1, { id: 11, beginner_mode: false });
  await login(view);
  expect(useAuthStore.getState().user.beginner_mode).toBe(false);
  expect(syncBeginnerProgress).toHaveBeenCalledTimes(1);
});

test("未ログインでも一段階ずつ進み、再読込でゲストの途中から再開する", async () => {
  const view = await mountAt("/beginner", false);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "出来た" })); });
  await act(async () => { jest.advanceTimersByTime(700); });
  expect(screen.getByText("STEP 2 / 6")).toBeInTheDocument();
  view.unmount();
  await mountAt("/beginner", false);
  expect(screen.getByText("STEP 2 / 6")).toBeInTheDocument();
  expect(syncBeginnerProgress).not.toHaveBeenCalled();
});

test("初心者のプロフィールには通常ランクの進化演出を表示しない", async () => {
  serverUser = userAt(1, { last_seen_animal: { id: 2, name: "りす", avatar_path: "/squirrel.webp" } });
  await mountAt("/profile");
  await act(async () => { jest.advanceTimersByTime(3100); });
  expect(screen.getByAltText("たまご ステップ1")).toBeInTheDocument();
  expect(screen.queryByText(/おめでとう！ひよこに進化しました/)).not.toBeInTheDocument();
});

test("出来たを連打しても一度に一段階だけ進む", async () => {
  await mountAt("/beginner");
  fireEvent.click(screen.getByRole("button", { name: "出来た" }));
  expect(screen.getByRole("button", { name: "たまごが動いています…" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "たまごが動いています…" }));
  await act(async () => { jest.advanceTimersByTime(700); });
  expect(screen.getByText("STEP 2 / 6")).toBeInTheDocument();
  expect(syncBeginnerProgress).toHaveBeenCalledTimes(1);
});

describe.each(["/profile", "/edit"])("%s の初心者AnimalCard", (path) => {
  test.each([1, 2, 3, 4, 5])("ステップ%sで通常ランクのひよこより保存済みの卵の状態を優先する", async (step) => {
    serverUser = userAt(step);
    // Stale or older API responses may still contain the normal chick rank.
    serverUser.display_animal = serverUser.current_animal;
    await mountAt(path);
    expect(screen.getByRole("heading", { name: "たまご" })).toBeInTheDocument();
    expect(screen.getByAltText(`たまご ステップ${step}`)).toHaveAttribute("src", beginnerSteps[step - 1].image);
    expect(screen.getByText(beginnerSteps[step - 1].title)).toBeInTheDocument();
    expect(screen.getByText(`初心者コース ${step} / 6`)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ひよこ" })).not.toBeInTheDocument();
    expect(syncBeginnerProgress).not.toHaveBeenCalled();
  });
});
