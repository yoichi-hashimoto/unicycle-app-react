import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import { fetchUsers } from "../../../api/users";
import { clubLabel, compareClubNames } from "../../../utils/club";
import classes from "./Practices.module.css";

const statuses = { unanswered: "未回答", attending: "参加予定", absent: "欠席", attended: "参加済み（1ポイント）" };
const dateFormat = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" });

export default function Practices() {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([axios.get("/api/practices"), fetchUsers()]).then(([response, members]) => {
      if (!active) return;
      setSessions(response.data);
      setSelected(String(response.data[0]?.id ?? ""));
      setUsers(members.filter(user => user.role !== "gurdian").sort((a, b) => compareClubNames(a.club_name, b.club_name) || a.name.localeCompare(b.name, "ja")));
    }).catch(() => { if (active) setError("練習会を読み込めませんでした。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const practice = sessions.find(session => String(session.id) === selected);
  const changeAttendance = async (user, status) => {
    setSaving(true); setError(""); setMessage("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.put(`/api/practices/${practice.id}/attendance/${user.id}`, { status });
      setSessions(previous => previous.map(session => session.id !== practice.id ? session : {
        ...session, attendances: [...session.attendances.filter(row => row.user_id !== user.id), response.data.attendance],
      }));
      setMessage(`${user.name}さんの出欠を保存しました。`);
    } catch (error) {
      setError(error.response?.data?.errors?.status?.[0] ?? "出欠の保存に失敗しました。");
    } finally { setSaving(false); }
  };
  return <section className={classes.container}>
    <h1>練習会の出欠確認</h1>
    <p><Link to="/notice">お知らせ作成</Link>で「練習会のお知らせ」を選ぶと練習会を登録できます。</p>
    <p>開催後に「参加済み」にすると1ポイントを付与します。欠席などに訂正すると、その回の参加ポイントを取り消します。</p>
    {loading && <p role="status">読み込み中…</p>}
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    {!loading && !sessions.length && <p>練習会はまだ登録されていません。</p>}
    {!!sessions.length && <>
      <label htmlFor="practice-select">練習会</label>
      <select id="practice-select" value={selected} disabled={saving} onChange={event => { setSelected(event.target.value); setMessage(""); setError(""); }}>
        {sessions.map(session => <option key={session.id} value={session.id}>{dateFormat.format(new Date(session.starts_at))} {session.notice.title}</option>)}
      </select>
      {practice && <>
        <p>{practice.location} ／ 参加予定 {practice.attendances.filter(row => row.status === "attending").length}人 ／ 参加済み {practice.attendances.filter(row => row.status === "attended").length}人</p>
        <div className={classes.tableScroll}><table>
          <thead><tr><th>所属クラブ</th><th>メンバー</th><th>出欠</th></tr></thead>
          <tbody>{users.map(user => <tr key={user.id}>
            <td>{clubLabel(user.club_name)}</td><th scope="row">{user.name}</th>
            <td><select aria-label={`${user.name}の出欠`} disabled={saving}
              value={practice.attendances.find(row => row.user_id === user.id)?.status ?? "unanswered"}
              onChange={event => changeAttendance(user, event.target.value)}>
              {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}
                disabled={value === "attended" && new Date(practice.starts_at) > new Date()}>{label}</option>)}
            </select></td>
          </tr>)}</tbody>
        </table></div>
      </>}
    </>}
  </section>;
}
