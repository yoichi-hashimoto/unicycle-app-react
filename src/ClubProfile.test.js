import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "fs";
import path from "path";
import Ranking from "./components/pages/Ranking";
import Challenge from "./components/pages/Challenge";
import Edit from "./components/pages/Edit";
import Register from "./components/pages/admin/Register";
import TipCard from "./components/common/cards/TipCard";
import ProfileActivity from "./components/profile/ProfileActivity";
import { fetchUsers } from "./api/users";
import { fetchChallenges } from "./api/challenges";
import { fetchProfileActivity } from "./api/profile";
import { fetchAvatars } from "./api/avatars";
import { fetchColors } from "./api/color";
import axios from "./api/axios";
import { useAuthStore } from "./stores/authStore";

jest.mock("./api/users", () => ({ fetchUsers: jest.fn() }));
jest.mock("./api/challenges", () => ({ fetchChallenges: jest.fn() }));
jest.mock("./api/profile", () => ({ fetchProfileActivity: jest.fn() }));
jest.mock("./api/avatars", () => ({ fetchAvatars: jest.fn().mockResolvedValue([]) }));
jest.mock("./api/color", () => ({ fetchColors: jest.fn().mockResolvedValue([]) }));
jest.mock("./api/axios", () => ({ get: jest.fn(), patch: jest.fn(), post: jest.fn() }));

function member(id, club_name, current_level = 1) {
  return { id, name: `会員${id}`, role: "member", club_name, current_level, remain_level: 5,
    current_animal: { id: 1, name: "ひよこ", avatar_path: "/chick.webp", avatar_path_walk: "/chick.webp" },
    avatar_path: "/avatar.webp", received_likes: 0, success_score: 0, user_items: [], skill_name: "壁で10秒安定" };
}
async function mount(page) {
  let view;
  await act(async () => { view = render(<MemoryRouter>{page}</MemoryRouter>); });
  return view;
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  useAuthStore.getState().setUser(member(1, "あおぞらクラブ"));
  axios.get.mockResolvedValue({});
  axios.post.mockResolvedValue({});
  fetchUsers.mockResolvedValue([]);
  fetchAvatars.mockResolvedValue([]);
  fetchColors.mockResolvedValue([]);
});
afterEach(() => { jest.useRealTimers(); });

test("ランキングのクラブ順は同じクラブをレベル順にまとめ、未設定を最後にする", async () => {
  fetchUsers.mockResolvedValue([member(1, null), member(2, "さくらクラブ"), member(3, "あおぞらクラブ", 2), member(4, "あおぞらクラブ", 5)]);
  const view = await mount(<Ranking />);
  fireEvent.click(screen.getByRole("button", { name: "クラブ順" }));
  expect(screen.getAllByRole("heading", { level: 3 }).map(el => el.textContent)).toEqual(["会員4", "会員3", "会員2", "会員1"]);
  expect(screen.getAllByLabelText("所属クラブ: あおぞらクラブ")).toHaveLength(2);
  expect(screen.getByLabelText("所属クラブ: クラブ未設定")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "新しい順" }));
  expect(view.container.querySelectorAll("h3")[0]).toHaveTextContent("会員4");
});

test("チャレンジのクラブ順は同じクラブ内を新しい順にまとめる", async () => {
  const records = [
    [1, null, "2026-10-08"], [2, "さくらクラブ", "2026-10-08"],
    [3, "あおぞらクラブ", "2026-10-06"], [4, "あおぞらクラブ", "2026-10-07"],
  ].map(([id, club_name, created_at]) => ({ id, club_name, created_at, user_name: `会員${id}`,
    user_avatar_path: "/avatar.webp", current_animal: "/chick.webp", skill_name: "壁で10秒安定",
    current_level: 1, success_score: 1, received_likes: 0, skill_category: "基礎" }));
  fetchChallenges.mockResolvedValue(records);
  const view = await mount(<Challenge />);
  fireEvent.click(screen.getByRole("button", { name: "クラブ順" }));
  expect([...view.container.querySelectorAll(".userName")].map(el => el.textContent)).toEqual(["会員4", "会員3", "会員2", "会員1"]);
  expect(screen.getAllByText("あおぞらクラブ")).toHaveLength(2);
});

test.each(["さくらクラブ", ""])("プロフィール編集でクラブを「%s」に変更するとプレビューと保存に反映する", async (nextClub) => {
  axios.patch.mockResolvedValue({ data: { data: member(1, nextClub || null) } });
  await mount(<Edit />);
  const field = screen.getByRole("textbox", { name: "所属クラブ" });
  expect(field).toHaveValue("あおぞらクラブ");
  fireEvent.change(field, { target: { value: nextClub } });
  expect(screen.getByLabelText(`所属クラブ: ${nextClub || "クラブ未設定"}`)).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "とうろく" })); });
  expect(axios.patch).toHaveBeenCalledWith("/api/users/1", { club_name: nextClub || null });
  expect(useAuthStore.getState().user.club_name).toBe(nextClub || null);
});

test("管理者の新規登録フォームからクラブ名を保存する", async () => {
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
  await mount(<Register />);
  const field = screen.getByRole("textbox", { name: "所属クラブ" });
  expect(field).toHaveValue("あおぞらクラブ");
  fireEvent.change(field, { target: { value: "さくらクラブ" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "登録する" })); });
  expect(axios.post).toHaveBeenCalledWith("/api/users", expect.objectContaining({ club_name: "さくらクラブ" }));
  confirm.mockRestore();
});

test("技のコメントに投稿者の所属クラブを表示し、未設定も扱える", async () => {
  await mount(<TipCard skillTips={[
    { id: 1, user: member(1, "あおぞらクラブ"), text: "前を見よう", created_at: "2026-10-08" },
    { id: 2, user: member(2, null), text: "がんばれ", created_at: "2026-10-08" },
  ]} />);
  expect(screen.getByText("あおぞらクラブ")).toBeInTheDocument();
  expect(screen.getByText("クラブ未設定")).toBeInTheDocument();
});

test("チャレンジ履歴のいいね一覧に通常時の表示指定が漏れず、不要な影を出さない", async () => {
  fetchProfileActivity.mockResolvedValue({ days_since_last_challenge: 0, activities: [], challenges: [
    { id: 1, skill_name: "壁で10秒安定", success_score: 3, created_at: "2026-10-08", received_likes: 1,
      like_users: [{ id: 2, name: "応援者", avatar_path: "/avatar.webp" }] },
  ] });
  const view = await mount(<ProfileActivity />);
  const popup = view.container.querySelector('[role="tooltip"]');
  const style = document.createElement("style");
  style.textContent = fs.readFileSync(path.join(__dirname, "components/profile/ProfileActivity.module.css"), "utf8");
  document.head.appendChild(style);
  try {
    // Check the actual matching rules; JSDOM does not resolve selector specificity like a browser.
    const displays = [...style.sheet.cssRules]
      .filter(rule => rule.selectorText && rule.style.display && popup.matches(rule.selectorText))
      .map(rule => rule.style.display);
    expect(displays).toEqual(["none"]);
    const history = screen.getByRole("heading", { name: "チャレンジ履歴" }).parentElement;
    expect(within(history).getByText("壁で10秒安定")).toBeInTheDocument();
    expect(screen.getByText("まだアクティビティがありません。")).toBeInTheDocument();
  } finally { style.remove(); }
});
