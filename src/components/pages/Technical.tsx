import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSkills } from "../../api/skills";
import { fetchUsers } from "../../api/users";
import { useAuthStore } from "../../stores/authStore";
import type { SkillType } from "../common/type/skill";
import type { UserType } from "../common/type/user";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import { isBasicSkill } from "../../features/roadmap/catalog";
import { GenreFork, GenreLane, SkillLane } from "../roadmap/SkillRoadmap";
import classes from "../roadmap/SkillRoadmap.module.css";

function Technical() {
  const user = useAuthStore(state => state.user);
  const authLoading = useAuthStore(state => state.isLoading);
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [admins, setAdmins] = useState<UserType[]>([]);
  const [genre, setGenre] = useState("ジャンプ系");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const userId = user?.id;
  useEffect(() => {
    if (authLoading) return;
    if (!userId) { setLoading(false); return; }
    let active = true;
    setLoading(true); setError("");
    Promise.all([fetchSkills(), fetchUsers().catch(() => [])]).then(([data, members]) => {
      if (!active) return;
      setSkills(data);
      setAdmins(members.filter((member: UserType) => member.role === "admin"));
      const current = data.find((skill: SkillType) => !isBasicSkill(skill) && skill.is_current);
      if (current) setGenre(current.category);
    }).catch(() => { if (active) setError("技を読み込めませんでした。もう一度お試しください。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, authLoading, retry]);
  const targetSelected = async (updated: any) => {
    setSkills(previous => previous.map(skill => ({ ...skill, is_current: skill.id === updated.target_skill_id })));
    if (updated.target_skill?.category) setGenre(updated.target_skill.category);
    try {
      const data = await fetchSkills();
      if (useAuthStore.getState().user?.id !== updated.id) return;
      setSkills(data);
      setMessage(`次の目標を「${updated.target_skill?.name}」に設定しました。`);
    } catch {
      setMessage("目標は保存済みです。技の表示を更新できなかったため、再読み込みしてください。");
    }
  };
  const basic = skills.filter(isBasicSkill).sort((a, b) => a.required_level - b.required_level);
  const advanced = skills.filter(skill => !isBasicSkill(skill));
  const freeCourse = user?.current_level >= 26;
  const currentBasic = basic.find(skill => skill.is_current)?.id ?? basic.find(skill => skill.required_level === user?.current_level)?.id;

  if (!authLoading && !user) return <div className={classes.page}><p><Link to="/login">ログイン</Link>して技の道のりを見よう。</p></div>;
  return <div className={classes.page}>
    <div className={classes.top}><div><h1>わざの道のり</h1><p className={classes.sub}>できた道を振り返り、次の一歩を選ぼう。</p></div><Button onClick={() => setIsOpen(true)}>テストについて</Button></div>
    {loading && <p role="status">技を読み込み中…</p>}
    {error && <div className={classes.error}><p role="alert">{error}</p><button type="button" className={classes.retry} onClick={() => setRetry(value => value + 1)}>再読み込み</button></div>}
    {message && <p role="status">{message}</p>}
    {!loading && !error && <>
      <div className={classes.summary}>
        {user?.role === "gurdian" ? <span>閲覧専用：技のつながりを見られます。</span> : <>
        <span>基礎 {basic.filter(skill => skill.is_cleared).length} / {basic.length}技 達成</span>
        <span>自由コース {advanced.filter(skill => skill.is_cleared).length} / {advanced.length}技 達成</span>
        <span>{user?.target_skill ? `次の目標：${user.target_skill.name}` : freeCourse ? "次の目標を選ぼう" : `現在 Lv${user?.current_level ?? 1}`}</span>
        </>}
      </div>
      <section className={classes.section} aria-labelledby="skill-basic-title">
        <h2 id="skill-basic-title">01　基礎の一本道</h2><p className={classes.sub}>Lv1 → Lv25　順番にチャレンジ</p>
        <div className={classes.legend} aria-label="カードの見方"><span><i className={classes.clearKey} />クリア済み：半透明・振り返り可</span><span><i className={classes.currentKey} />いまここ</span><span><i />未クリア：透明にしない</span></div>
        <SkillLane skills={basic} label="基礎" basic focusId={freeCourse ? "free" : currentBasic} onTargetSelected={targetSelected} />
        <p className={classes.sub}>横にスクロールして、過去の技やこれからの技を見られます。</p>
      </section>
      <section className={classes.section} aria-labelledby="skill-genre-title">
        <h2 id="skill-genre-title">02　Lv26〜は、好きな道へ</h2>
        <p className={classes.sub}>{user?.role === "gurdian" ? "閲覧専用です。各ジャンルの技やコメントを見られます。" : freeCourse ? "全ジャンル開放中。前提の技を達成しながら、好きな目標を選ぼう。" : "基礎25技をクリアすると全ジャンルが開放。これからの技も見られます。"}</p>
        <GenreFork skills={advanced} selected={genre} onSelect={setGenre} />
        <GenreLane skills={advanced} genre={genre} onTargetSelected={targetSelected} />
        <p className={classes.sub}>線は前提となる技とのつながりです。自由コースのポイントは初回合格時に付与されます。</p>
      </section>
    </>}
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}><div className={classes.help}>
      <h2>テストについて</h2><ol><li>基礎はLv1から順番に進みます。技のカードを開いてコツやコメントを確認しよう。</li><li>基礎25技をクリアすると、6ジャンルから次の目標を選べます。</li><li>指導者に検定をお願いし、3回成功すると合格です。</li><li>自由コースは初回合格時だけポイントを獲得できます。再挑戦でレベルが下がることはありません。</li></ol>
      <h3>この人にテストをお願いしよう</h3><div className={classes.teachers}>{admins.map(admin => <div className={classes.teacher} key={admin.id}><img src={admin.avatar_path} alt="" /><p>{admin.name}</p></div>)}</div>
    </div></Modal>
  </div>;
}
export default Technical;
