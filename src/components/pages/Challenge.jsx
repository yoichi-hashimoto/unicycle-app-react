import HistoryCard from "../common/cards/HistoryCard";

const histories = [
  {
    id: 1,
    user_name: "よういち",
    avatar: "./images/users/boy_1.png",
    level:10,
    challenge: "片足走行１周",
    date: "2024-06-01",
    is_passed: true,
    animalAvatar: "./images/animals/stand_tiger.png",
    receivedLikes:3,
  },
  {
    id: 2,
    user_name: "なお",
    avatar: "./images/users/girl_4.png",
    level:15,
    challenge: "アリーナ1周から反対回り1周",
    date: "2024-06-02",
    is_passed: false,
    animalAvatar: "./images/animals/stand_fox.png",
    receivedLikes: 35,
  },
];

function Challenge({ showButton = true }) {

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>みんなのチャレンジ</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {histories.map((history) => (
          <HistoryCard key={history.id} history={history} />
        ))}
      </div>
    </div>
  );
}

export default Challenge;
