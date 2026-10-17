import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Technical from "./components/pages/Technical";
import Test from "./components/pages/admin/Test";
import { useAuthStore } from "./stores/authStore";
import { fetchSkills } from "./api/skills";
import { fetchUsers } from "./api/users";
import axios from "./api/axios";

jest.mock("./api/skills", () => ({ fetchSkills: jest.fn() }));
jest.mock("./api/users", () => ({ fetchUsers: jest.fn() }));
jest.mock("./api/axios", () => ({ get: jest.fn(), post: jest.fn(), patch: jest.fn() }));

const member = { id: 7, name: "本人", role: "member", current_level: 3, target_skill_id: null, target_skill: null, received_likes: 0 };
const makeSkill = (id, name, category, overrides = {}) => ({ id, name, category, required_level: id, avatar_path: "/skill.webp", description: "練習のコツ",
  point: id > 25 ? 2 : 0, skill_tips: [], unread_tip_count: 0, is_basic: category === "基礎", is_cleared: false, is_available: false,
  is_current: false, prerequisite_ids: [], prerequisite_names: [], roadmap_order: id, ...overrides });
const basic = [makeSkill(1, "基礎1", "基礎", { is_cleared: true }), makeSkill(2, "基礎2", "基礎", { is_cleared: true }), makeSkill(3, "基礎3", "基礎", { is_available: true, is_current: true })];
const advanced = [makeSkill(26, "ホッピング3回", "ジャンプ系", { locked_reason: "基礎25技をクリアすると挑戦できます。" }),
  makeSkill(31, "片足走行5m", "片足系"), makeSkill(32, "片足走行10m", "片足系", { prerequisite_ids: [31], prerequisite_names: ["片足走行5m"] }),
  makeSkill(39, "右スピン3周", "スピン・ターン系")];
let skills;

async function mount(page) {
  let view;
  await act(async () => { view = render(<MemoryRouter>{page}</MemoryRouter>); });
  return view;
}
beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.getState().setUser(member);
  skills = [...basic, ...advanced].map(skill => ({ ...skill }));
  fetchSkills.mockImplementation(async () => skills);
  fetchUsers.mockResolvedValue([]);
  axios.get.mockResolvedValue({ data: [] });
  axios.patch.mockResolvedValue({});
  axios.post.mockResolvedValue({});
});

test("基礎の現在地を示し、本人のクリア済みだけを半透明の振り返りカードにする", async () => {
  const view = await mount(<Technical />);
  expect(screen.getByRole("heading", { name: "わざの道のり" })).toBeInTheDocument();
  expect(screen.getByText("基礎 2 / 3技 達成")).toBeInTheDocument();
  const cleared = screen.getByRole("button", { name: "レベル1 基礎1の詳細（クリア済み）" });
  expect(cleared.closest("article")).toHaveClass("roadmapCleared");
  expect(screen.getByRole("button", { name: "レベル3 基礎3の詳細" }).closest("article")).not.toHaveClass("roadmapCleared");
  expect(view.container.querySelector('[data-skill-id="3"] .currentMarker')).toHaveTextContent("いまここ");
  await act(async () => { fireEvent.click(cleared); });
  expect(screen.getByText("達成済みの技です。コツやコメントを振り返れます。")).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith("/api/skill/1/tips");
});

test("6ジャンルを選べて、未解放の技も透明にせず詳細と前提を見られる", async () => {
  await mount(<Technical />);
  const choices = screen.getByRole("navigation", { name: "自由コースのジャンル" });
  expect(within(choices).getAllByRole("button")).toHaveLength(6);
  const hops = screen.getByRole("button", { name: "ホッピング3回の詳細" });
  expect(hops.closest("article")).not.toHaveClass("roadmapCleared");
  expect(hops).not.toBeDisabled();
  await act(async () => { fireEvent.click(hops); });
  expect(screen.getByRole("button", { name: "この技を目標にする" })).toBeDisabled();
  expect(screen.getAllByText("基礎25技をクリアすると挑戦できます。").length).toBeGreaterThan(0);
});

test("自由コースの技を選ぶと目標を保存し、再取得したカードの現在地を更新する", async () => {
  const user = { ...member, current_level: 26 };
  useAuthStore.getState().setUser(user);
  skills = [...basic.map(skill => ({ ...skill, is_cleared: true, is_available: false, is_current: false })), ...advanced.map(skill => ({ ...skill, is_available: true, locked_reason: null }))];
  axios.patch.mockImplementation(async (url, payload) => {
    if (url !== "/api/user/skill-target") return {};
    const target = skills.find(skill => skill.id === payload.skill_id);
    skills = skills.map(skill => ({ ...skill, is_current: skill.id === target.id }));
    return { data: { data: { ...user, target_skill_id: target.id, target_skill: target } } };
  });
  await mount(<Technical />);
  fireEvent.click(screen.getByRole("button", { name: /片足系.*2技/ }));
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "片足走行5mの詳細" })); });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "この技を目標にする" })); });
  expect(axios.patch).toHaveBeenCalledWith("/api/user/skill-target", { skill_id: 31 });
  expect(useAuthStore.getState().user.target_skill.name).toBe("片足走行5m");
  expect(screen.getByRole("status")).toHaveTextContent("次の目標を「片足走行5m」に設定しました");
  expect(screen.getByRole("button", { name: "片足走行5mの詳細" }).closest("article")).toHaveClass("roadmapCurrent");
});

test("保存失敗時は元の目標を保持し、エラーを表示する", async () => {
  useAuthStore.getState().setUser({ ...member, current_level: 26 });
  skills = [...basic, { ...advanced[0], is_available: true, locked_reason: null }];
  axios.patch.mockImplementation(async url => {
    if (url === "/api/user/skill-target") throw { response: { data: { errors: { skill_id: ["前提の技を確認してください"] } } } };
    return {};
  });
  await mount(<Technical />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ホッピング3回の詳細" })); });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "この技を目標にする" })); });
  expect(screen.getByRole("alert")).toHaveTextContent("前提の技を確認してください");
  expect(useAuthStore.getState().user.target_skill_id).toBeNull();
});

test("目標の保存後に再取得だけ失敗した場合は保存済みとして案内する", async () => {
  const user = { ...member, current_level: 26 };
  useAuthStore.getState().setUser(user);
  skills = [...basic, { ...advanced[0], is_available: true, locked_reason: null }];
  axios.patch.mockImplementation(async url => {
    if (url !== "/api/user/skill-target") return {};
    fetchSkills.mockRejectedValueOnce(new Error("Reload failed"));
    return { data: { data: { ...user, target_skill_id: 26, target_skill: advanced[0] } } };
  });
  await mount(<Technical />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ホッピング3回の詳細" })); });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "この技を目標にする" })); });
  expect(screen.getByRole("status")).toHaveTextContent("目標は保存済みです");
  expect(useAuthStore.getState().user.target_skill_id).toBe(26);
});

test("閲覧者は技の道を見られるが目標設定はできない", async () => {
  useAuthStore.getState().setUser({ ...member, role: "gurdian" });
  await mount(<Technical />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "ホッピング3回の詳細" })); });
  expect(screen.queryByRole("button", { name: "この技を目標にする" })).not.toBeInTheDocument();
});

test("技の読み込み失敗から再試行できる", async () => {
  fetchSkills.mockRejectedValueOnce(new Error("Network"));
  await mount(<Technical />);
  expect(screen.getByRole("alert")).toHaveTextContent("技を読み込めませんでした");
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "再読み込み" })); });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ホッピング3回の詳細" })).toBeInTheDocument();
});

test("管理者検定は本人の選んだジャンルと技を初期表示し、3回成功でサーバーに記録する", async () => {
  const target = { ...advanced[1], is_available: true };
  fetchUsers.mockResolvedValue([{ ...member, current_level: 26, target_skill_id: 31, target_skill: target, remain_skills: { basic_skill: null, next_skill: [target] } }]);
  await act(async () => { render(<MemoryRouter initialEntries={["/test"]}><Routes><Route path="/test" element={<Test />} /><Route path="/challenge" element={<p>検定を保存しました</p>} /></Routes></MemoryRouter>); });
  expect(screen.getByRole("combobox", { name: "技のジャンル" })).toHaveValue("片足系");
  expect(screen.getByRole("combobox", { name: "チャレンジする技" })).toHaveValue("31");
  for (let i = 0; i < 3; i++) await act(async () => { fireEvent.click(screen.getByRole("button", { name: "成功👍" })); });
  expect(axios.post).toHaveBeenCalledWith("/api/challenges", { user_id: 7, skill_id: 31, success_score: 3 });
  expect(screen.getByText("検定を保存しました")).toBeInTheDocument();
});
