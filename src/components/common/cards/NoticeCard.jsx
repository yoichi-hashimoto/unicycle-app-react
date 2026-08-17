import classes from "./NoticeCard.module.css";

function NoticeCard({ notices }) {
  return (
    <>
      <div className={classes.noticeContainer}>
        <table className={classes.noticeTable}>
          <thead>
            <tr className={classes.noticeTitle}>
              <th>日付</th>
              <th>タイトル</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.created_at}</td>
                <td>{notice.title}</td>
                <td>{notice.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default NoticeCard;
