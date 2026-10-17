import MemberCard from "../../common/cards/MemberCard";
import { useState, useEffect } from "react";
import classes from "./Test.module.css";
import Button from "../../common/button/Button";
import { fetchUsers } from "../../../api/users";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { roadmapGenres } from "../../../features/roadmap/catalog";

function Test() {
  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("基礎");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [success, setSuccess] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    fetchUsers().then(data => {
      if (!active) return;
      const members = data.filter(user => user.role !== "gurdian");
      setUsers(members);
      const first = members[0] ?? null;
      setSelectedMember(first);
      if (first?.current_level >= 26) setSelectedCategory(first.target_skill?.category ?? first.remain_skills?.next_skill?.[0]?.category ?? "基礎");
    }).catch(() => { if (active) setError("メンバーを読み込めませんでした。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!selectedMember) return;
    if (selectedCategory === "基礎") setSelectedSkill(selectedMember.remain_skills?.basic_skill ?? null);
    else {
      const available = (selectedMember.remain_skills?.next_skill ?? []).filter(skill => skill.category === selectedCategory);
      setSelectedSkill(available.find(skill => skill.id === selectedMember.target_skill_id) ?? available[0] ?? null);
    }
    setSuccess(0); setError("");
  }, [selectedCategory, selectedMember]);
  const nextSkills = selectedMember?.remain_skills?.next_skill ?? [];
  const categories = ["基礎", ...roadmapGenres.map(genre => genre.name), ...Array.from(new Set(nextSkills.map(skill => skill.category))).filter(name => !roadmapGenres.some(genre => genre.name === name))];
  const availableSkills = nextSkills.filter(skill => skill.category === selectedCategory);
  const saveResult = async score => {
    if (saving || !selectedMember || !selectedSkill) return;
    setSaving(true); setError("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/challenges", { user_id: selectedMember.id, skill_id: selectedSkill.id, success_score: score });
      navigate("/challenge");
    } catch (error) {
      setError(error.response?.data?.errors?.skill_id?.[0] ?? "検定結果を保存できませんでした。もう一度お試しください。");
    } finally { setSaving(false); }
  };
  const addSuccess = async () => {
    if (saving || !selectedSkill) return;
    const next = Math.min(3, success + 1);
    setSuccess(next);
    if (next === 3) await saveResult(next);
  };
  const changeMember = event => {
    const member = users.find(user => user.id === Number(event.target.value));
    setSelectedMember(member);
    setSelectedCategory(member.current_level >= 26 ? member.target_skill?.category ?? member.remain_skills?.next_skill?.[0]?.category ?? "基礎" : "基礎");
  };
  if (loading) return <p role="status">メンバーを読み込み中…</p>;
  return <div className={classes.testContainer}>
    <h1>レベルアップ・技の検定</h1>
    {error && <p role="alert">{error}</p>}
    {!selectedMember ? <p>検定できるメンバーがいません。</p> : <>
      <div className={classes.challengeWrapper}>
        <div className={classes.selector}>
          <div className={classes.challengeSelector}><label htmlFor="test-member">チャレンジャー</label>
            <select id="test-member" value={selectedMember.id} disabled={saving} onChange={changeMember}>{users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
          </div>
          <div className={classes.challengeSelector}><label htmlFor="test-category">技のジャンル</label>
            <select id="test-category" value={selectedCategory} disabled={saving} onChange={event => setSelectedCategory(event.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select>
          </div>
        </div>
        <MemberCard member={selectedMember} level={selectedMember.current_level} success={success} showSkill={false} />
      </div>
      <div className={classes.nextChallenge}><h2>チャレンジする技</h2>
        {selectedCategory === "基礎" ? <p>{selectedSkill?.name ?? "基礎コースクリア済み！"}</p> : <>
          {availableSkills.length ? <select aria-label="チャレンジする技" value={selectedSkill?.id ?? ""} disabled={saving} onChange={event => { setSelectedSkill(availableSkills.find(skill => skill.id === Number(event.target.value)) ?? null); setSuccess(0); setError(""); }}>{availableSkills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}（{skill.point ?? 0}pt）</option>)}</select> : <p>{selectedMember.current_level < 26 ? "基礎25技をクリアすると挑戦できます。" : "前提の技を達成するか、別のジャンルを選んでください。"}</p>}
          {selectedSkill && <p>初回合格で {selectedSkill.point ?? 0} ポイント</p>}
        </>}
        {selectedSkill && <div className={classes.starContainer} aria-label={`成功 ${success}回`}>{[1, 2, 3].map(star => <img className={classes.star} key={star} src={star <= success ? "/images/star_filled.png" : "/images/star_blank.png"} alt="" />)}</div>}
      </div>
      <div className={classes.testButtons}><Button variant="primary" onClick={addSuccess} disabled={saving || !selectedSkill}>{saving ? "保存中…" : success === 3 ? "合格結果を再送" : "成功👍"}</Button>
        {success < 3 && <Button variant="outline" disabled={saving || !selectedSkill} onClick={() => { if (window.confirm("この成功回数で検定結果を記録しますか？")) saveResult(success); }}>失敗・終了</Button>}
      </div>
    </>}
  </div>;
}
export default Test;
