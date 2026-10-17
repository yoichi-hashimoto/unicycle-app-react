import classes from "./NoticeCard.module.css";

function NoticeCard({ notices }) {

  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    month: "long",day:"numeric",
  }).format;
  return (
    <>
      <div className={classes.noticeContainer}>
        <table className={classes.noticeTable}>
          <thead>
            <tr className={classes.noticeTitle}>
              <th>日付</th>
              <th>カテゴリ</th>
              <th>タイトル</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.created_at ? formattedDate(new Date(notice.created_at)) : "—"}</td>
                <td>{notice.category ?? "その他"}</td>
                <td>{notice.title}</td>
                <td>{notice.text}{notice.practice && <p>
                  {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notice.practice.starts_at))}<br />
                  場所：{notice.practice.location}
                </p>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default NoticeCard;
