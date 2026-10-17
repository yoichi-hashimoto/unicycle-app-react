import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./components/common/header/Header";
import Notice from "./components/pages/admin/Notice";
import Practices from "./components/pages/admin/Practices";
import TipCard from "./components/common/cards/TipCard";
import GrowthSummary from "./components/profile/GrowthSummary";
import SkillCard from "./components/common/cards/SkillCard";
import axios from "./api/axios";
import { fetchUsers } from "./api/users";
import { useAuthStore } from "./stores/authStore";

jest.mock("./api/axios", () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn() }));
jest.mock("./api/users", () => ({ fetchUsers: jest.fn() }));
const user = { id: 1, name: "本人", role: "member", beginner_mode: true, beginner_step: 1, club_name: "あおぞらクラブ" };
const root = { id: 10, user_id: 2, skill_id: 1, parent_id: null, text: "前を見よう", created_at: "2026-10-08T10:00:00Z",
  received_likes: 0, is_liked_by_me: false, user: { id: 2, name: "先生", club_name: "さくらクラブ", avatar_path: "/avatar.webp" } };
const practice = { id: 1, starts_at: "2026-10-01T10:00:00Z", location: "体育館", notice: { title: "合同練習" }, attendances: [] };
async function mount(page) {
  let view;
  await act(async () => { view = render(<MemoryRouter>{page}</MemoryRouter>); });
  return view;
}
beforeEach(() => {
  jest.useFakeTimers(); jest.clearAllMocks();
  useAuthStore.getState().setUser(user);
  axios.get.mockResolvedValue({});
  axios.post.mockResolvedValue({});
  axios.put.mockResolvedValue({});
  axios.patch.mockResolvedValue({});
});
afterEach(() => { jest.useRealTimers(); });

test.each([1, 5, 6])("ステップ%sのヘッダーとスマホメニューは完了状態に合わせて初心者コースを表示する", async step => {
  useAuthStore.getState().setUser({ ...user, beginner_step: step });
  await mount(<Header />);
  expect(screen.queryAllByRole("link", { name: "初心者コース" })).toHaveLength(step < 6 ? 1 : 0);
  fireEvent.click(screen.getByRole("button", { name: "メニューを開く" }));
  expect(screen.queryAllByRole("link", { name: "初心者コース" })).toHaveLength(step < 6 ? 2 : 0);
});

test("ゲストは初心者コースを開ける", async () => {
  useAuthStore.getState().setUser(null);
  await mount(<Header />);
  expect(screen.getByRole("link", { name: "初心者コース" })).toBeInTheDocument();
});

test("通知カテゴリを選択し、練習会の日時と場所を送信できる", async () => {
  const view = await mount(<Notice />);
  const category = screen.getByRole("combobox", { name: "通知カテゴリ" });
  expect(within(category).getAllByRole("option").map(option => option.textContent))
    .toEqual(["メンバー更新", "クラブ更新", "練習会のお知らせ", "システム変更", "その他"]);
  fireEvent.change(category, { target: { value: "練習会のお知らせ" } });
  fireEvent.change(screen.getByLabelText("タイトル"), { target: { value: "合同練習" } });
  fireEvent.change(screen.getByLabelText("テキスト"), { target: { value: "体育館で練習します" } });
  fireEvent.change(screen.getByLabelText("開催日時"), { target: { value: "2026-10-20T10:00" } });
  fireEvent.change(screen.getByLabelText("場所"), { target: { value: "体育館" } });
  await act(async () => { fireEvent.submit(view.container.querySelector("form")); });
  expect(axios.post).toHaveBeenCalledWith("/api/notices", { title: "合同練習", text: "体育館で練習します",
    category: "練習会のお知らせ", starts_at: new Date("2026-10-20T10:00").toISOString(), location: "体育館" });
});

test("管理者が出欠を保存でき、成功時だけ参加済み表示が更新される", async () => {
  axios.get.mockImplementation(async url => url === "/api/practices" ? { data: [practice] } : {});
  fetchUsers.mockResolvedValue([user, { id: 3, name: "保護者", role: "gurdian" }]);
  axios.put.mockResolvedValue({ data: { attendance: { user_id: 1, status: "attended" }, earned_points: 1 } });
  await mount(<Practices />);
  expect(screen.queryByRole("combobox", { name: "保護者の出欠" })).not.toBeInTheDocument();
  await act(async () => { fireEvent.change(screen.getByRole("combobox", { name: "本人の出欠" }), { target: { value: "attended" } }); });
  expect(axios.put).toHaveBeenCalledWith("/api/practices/1/attendance/1", { status: "attended" });
  expect(screen.getByRole("combobox", { name: "本人の出欠" })).toHaveValue("attended");
  expect(screen.getByRole("status")).toHaveTextContent("保存しました");
  axios.put.mockRejectedValueOnce(new Error("Network"));
  await act(async () => { fireEvent.change(screen.getByRole("combobox", { name: "本人の出欠" }), { target: { value: "absent" } }); });
  expect(screen.getByRole("alert")).toHaveTextContent("保存に失敗");
  expect(screen.getByRole("combobox", { name: "本人の出欠" })).toHaveValue("attended");
});

test("コメントへの返信を親に結び付けて表示し、❤でお礼を送れる", async () => {
  const reply = { ...root, id: 11, parent_id: 10, user_id: 1, text: "ありがとうございます", user };
  axios.post.mockImplementation(async url => url.endsWith("/likes")
    ? { data: { ...root, received_likes: 1, is_liked_by_me: true } } : { data: reply });
  await mount(<TipCard skillTips={[root]} skillId={1} />);
  fireEvent.click(screen.getByRole("button", { name: "返信" }));
  fireEvent.change(screen.getByRole("textbox", { name: "先生への返信" }), { target: { value: "ありがとうございます" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "返信を投稿" })); });
  expect(axios.post).toHaveBeenCalledWith("/api/skill/1/tips", { text: "ありがとうございます", parent_id: 10 });
  expect(screen.getByText("ありがとうございます")).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "❤でお礼" })); });
  expect(axios.post).toHaveBeenCalledWith("/api/skill-tips/10/likes");
  expect(screen.getByRole("button", { name: "お礼済み" })).toBeDisabled();
  expect(screen.getByLabelText("お礼の❤ 1件")).toBeInTheDocument();
});

test("返信の保存失敗時は入力を保持し、閲覧者には返信とお礼の操作を表示しない", async () => {
  axios.post.mockRejectedValue(new Error("Network"));
  const view = await mount(<TipCard skillTips={[root]} skillId={1} />);
  fireEvent.click(screen.getByRole("button", { name: "返信" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "返信です" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "返信を投稿" })); });
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toHaveValue("返信です");
  view.unmount();
  useAuthStore.getState().setUser({ ...user, role: "gurdian" });
  await mount(<TipCard skillTips={[root]} skillId={1} />);
  expect(screen.queryByRole("button", { name: "返信" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "❤でお礼" })).not.toBeInTheDocument();
});

test("個人ページに累計と実際の経過時間に比例したレベル推移を表示する", async () => {
  const history = [{ at: "2026-10-01T00:00:00Z", level: 1 }, { at: "2026-10-02T00:00:00Z", level: 2 }, { at: "2026-10-09T00:00:00Z", level: 3 }];
  const view = await mount(<GrowthSummary statistics={{ cleared_skill_count: 2, challenge_count: 5, received_likes: 99, heart_reward_points: 0 }} history={history} />);
  expect(screen.getByText("達成した技（累計）").nextElementSibling).toHaveTextContent("2 技");
  expect(screen.getByText("チャレンジ（累計）").nextElementSibling).toHaveTextContent("5 回");
  expect(screen.getByText(/次の区切りまであと1個/)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "横軸が時間、縦軸がレベルの成長グラフ" })).toBeInTheDocument();
  const circles = [...view.container.querySelectorAll("circle")];
  const positions = circles.map(circle => Number(circle.getAttribute("cx")));
  expect((positions[1] - positions[0]) / (positions[2] - positions[0])).toBeCloseTo(1 / 8);
});

test("技の詳細はコメントの再取得中に投稿を待ち、最新の返信と❤を表示する", async () => {
  let resolveTips;
  axios.get.mockImplementation(url => url === "/api/skill/1/tips"
    ? new Promise(resolve => { resolveTips = resolve; }) : Promise.resolve({}));
  await mount(<SkillCard skill={{ id: 1, name: "壁で10秒", required_level: 1, skill_tips: [], unread_tip_count: 0, avatar_path: "/skill.webp" }} />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "詳しく" })); });
  expect(screen.getByRole("status")).toHaveTextContent("コメントを読み込み中");
  expect(screen.getByRole("button", { name: "投稿" })).toBeDisabled();
  await act(async () => { resolveTips({ data: [{ ...root, received_likes: 5 }] }); });
  expect(screen.getByText("前を見よう")).toBeInTheDocument();
  expect(screen.getByLabelText("お礼の❤ 5件")).toBeInTheDocument();
  expect(axios.patch).toHaveBeenCalledWith("/api/skill/1/tips/read");
});
