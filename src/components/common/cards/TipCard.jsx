import { useEffect, useState } from "react";
import classes from "./TipCard.module.css";
import { clubLabel } from "../../../utils/club";
import { useAuthStore } from "../../../stores/authStore";
import axios from "../../../api/axios";

const formattedDate = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format;

function TipCard({ skillTips, skillId, onTipsChange }) {
  const user = useAuthStore(state => state.user);
  const [tips, setTips] = useState(skillTips);
  const [replyTo, setReplyTo] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setTips(skillTips); }, [skillTips]);
  const canWrite = !!user && user.role !== "gurdian";
  const updateTips = next => { setTips(next); onTipsChange?.(next); };
  const like = async tip => {
    setBusy(true); setError("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(`/api/skill-tips/${tip.id}/likes`);
      updateTips(tips.map(row => row.id === tip.id ? response.data : row));
    } catch { setError("❤を送れませんでした。もう一度お試しください。"); }
    finally { setBusy(false); }
  };
  const reply = async (event, tip) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true); setError("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(`/api/skill/${skillId ?? tip.skill_id}/tips`, { text: text.trim(), parent_id: tip.id });
      updateTips([...tips, response.data]);
      setText(""); setReplyTo(null);
    } catch { setError("返信を保存できませんでした。"); }
    finally { setBusy(false); }
  };
  const renderTip = tip => <div key={tip.id} className={classes.thread}>
    <article className={classes.tipsContainer} aria-label={`${tip.user?.name ?? "退会したメンバー"}のコメント`}>
      <div className={classes.author}>
        <p className={classes.clubName}>{clubLabel(tip.user?.club_name)}</p>
        <img src={tip.user?.avatar?.avatar_path ?? tip.user?.avatar_path} alt={tip.user?.name ?? "退会したメンバー"} />
        <p>{tip.user?.name ?? "退会したメンバー"}</p>
      </div>
      <div className={classes.tipsText}>
        <p><time dateTime={tip.created_at}>{formattedDate(new Date(tip.created_at))}</time></p>
        <p className={classes.commentText}>{tip.text}</p>
        <div className={classes.actions}>
          <span aria-label={`お礼の❤ ${tip.received_likes ?? 0}件`}>❤ {tip.received_likes ?? 0}</span>
          {canWrite && user.id !== tip.user_id && <button type="button" disabled={busy || tip.is_liked_by_me} onClick={() => like(tip)}>
            {tip.is_liked_by_me ? "お礼済み" : "❤でお礼"}
          </button>}
          {canWrite && <button type="button" disabled={busy} onClick={() => { setReplyTo(tip.id); setText(""); setError(""); }}>返信</button>}
        </div>
        {replyTo === tip.id && <form onSubmit={event => reply(event, tip)}>
          <label htmlFor={`reply-${tip.id}`}>{tip.user?.name ?? "コメント"}への返信</label>
          <textarea id={`reply-${tip.id}`} maxLength={255} required value={text} disabled={busy} onChange={event => setText(event.target.value)} />
          <button type="submit" disabled={busy || !text.trim()}>返信を投稿</button>
          <button type="button" disabled={busy} onClick={() => { setReplyTo(null); setText(""); }}>キャンセル</button>
        </form>}
      </div>
    </article>
    {tips.some(child => child.parent_id === tip.id) && <div className={classes.replies}>
      {tips.filter(child => child.parent_id === tip.id).map(renderTip)}
    </div>}
  </div>;
  return <div>
    {error && <p role="alert">{error}</p>}
    {tips.filter(tip => !tip.parent_id || !tips.some(parent => parent.id === tip.parent_id)).map(renderTip)}
  </div>;
}
export default TipCard;
