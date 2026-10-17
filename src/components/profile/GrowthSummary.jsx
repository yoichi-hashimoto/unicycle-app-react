import classes from "./GrowthSummary.module.css";

const dateLabel = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" });
const fullDate = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" });
const timeLabel = new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" });

export default function GrowthSummary({ statistics, history }) {
  if (!statistics) return null;
  const points = (history ?? []).map(point => ({ ...point, time: new Date(point.at).getTime() }))
    .filter(point => Number.isFinite(point.time)).sort((a, b) => a.time - b.time);
  const lastTime = points[points.length - 1]?.time ?? Date.now();
  const firstTime = Math.min(points[0]?.time ?? lastTime, lastTime - 86400000);
  const maxLevel = Math.max(6, ...points.map(point => point.level));
  const x = time => 52 + (time - firstTime) / (lastTime - firstTime) * 568;
  const y = level => 210 - (level - 1) / (maxLevel - 1) * 175;
  const line = points.map((point, index) => index === 0
    ? `M ${x(point.time)} ${y(point.level)}` : `H ${x(point.time)} V ${y(point.level)}`).join(" ");
  const hearts = statistics.received_likes ?? 0;
  return <section className={classes.summary} aria-labelledby="growth-title">
    <h2 id="growth-title">これまでの成長</h2>
    <dl className={classes.totals}>
      <div><dt>達成した技（累計）</dt><dd>{statistics.cleared_skill_count}<small> 技</small></dd></div>
      <div><dt>チャレンジ（累計）</dt><dd>{statistics.challenge_count}<small> 回</small></dd></div>
      <div><dt>受け取った❤（合計）</dt><dd>{hearts}<small> 個</small></dd></div>
      <div><dt>❤で獲得したポイント</dt><dd>{statistics.heart_reward_points ?? 0}<small> pt</small></dd></div>
    </dl>
    <p>❤はチャレンジとコメントのお礼の合計です。100個ごとに5ポイント。次の区切りまであと{100 - hearts % 100}個！</p>
    <h3>レベルの推移</h3>
    {points.length > 0 ? <>
      <div className={classes.chartScroll}>
        <svg viewBox="0 0 660 292" role="img" aria-label="横軸が時間、縦軸がレベルの成長グラフ">
          <title>レベルの推移：横軸は時間、縦軸はレベル</title>
          {[...new Set([1, Math.ceil(maxLevel / 2), maxLevel])].map(level => <g key={level}>
            <line x1="52" x2="620" y1={y(level)} y2={y(level)} stroke="#dce8df" />
            <text x="43" y={y(level) + 4} textAnchor="end" fontSize="12">{level}</text>
          </g>)}
          <text x="16" y="20" fontSize="12">レベル</text>
          <line x1="52" x2="52" y1="35" y2="210" stroke="#708377" />
          <line x1="52" x2="620" y1="210" y2="210" stroke="#708377" />
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const time = firstTime + (lastTime - firstTime) * ratio;
            return <g key={ratio}><line x1={x(time)} x2={x(time)} y1="210" y2="216" stroke="#708377" />
              <text x={x(time)} y="238" textAnchor="middle" fontSize="12">{dateLabel.format(new Date(time))}</text>
              {lastTime - firstTime <= 2 * 86400000 && <text x={x(time)} y="254" textAnchor="middle" fontSize="10">{timeLabel.format(new Date(time))}</text>}</g>;
          })}
          <text x="338" y="282" textAnchor="middle" fontSize="12">時間</text>
          <path d={line} stroke="#218e44" strokeWidth="3" fill="none" />
          {points.map((point, index) => <circle key={index} cx={x(point.time)} cy={y(point.level)} r="4" fill="#218e44">
            <title>{fullDate.format(new Date(point.time))} レベル{point.level}</title>
          </circle>)}
        </svg>
      </div>
      <details><summary>日時とレベルを表で見る</summary><div className={classes.chartScroll}><table>
        <thead><tr><th>日時</th><th>レベル</th></tr></thead>
        <tbody>{points.map((point, index) => <tr key={index}><td>{fullDate.format(new Date(point.time))}</td><td>{point.level}</td></tr>)}</tbody>
      </table></div></details>
    </> : <p>これからのチャレンジがグラフに記録されます。</p>}
  </section>;
}
