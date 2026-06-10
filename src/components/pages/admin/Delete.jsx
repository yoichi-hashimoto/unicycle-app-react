import classes from "./Delete.module.css";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "よういち",
    level: 1,
    receivedLikes: 2,
    avatar: "./images/users/boy_1.png",
    animal_avatar: "./images/animals/stand_rabbit.png",
  },
  {
    id: 2,
    name: "ゆうき",
    level: 3,
    receivedLikes: 10,
    avatar: "./images/users/girl_4.png",
    animal_avatar: "./images/animals/stand_fox.png",
  },
];

function Delete() {
  const [userList, setUserList] = useState(users);
  const showAleart = () => {
    return window.confirm("本当に削除しますか？");
  };

  const handleDelete = (id) => {
    const isConfirmed = showAleart();
    if (isConfirmed) {
      setUserList(userList.filter((user) => user.id !== id));
      console.log("削除しました");
    } else {
      console.log("キャンセルされました");
    }
  };

  return (
    <div className={classes.tableContainer}>
      <table className={classes.deleteTable}>
        <thead>
          <tr>
            <th>削除</th>
            <th>名前</th>
            <th>アバター</th>
            <th>レベル</th>
            <th>動物</th>
            <th>いいね</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>
                <button onClick={() => handleDelete(user.id)}>削除する</button>
              </td>
              <td>{user.name}</td>
              <td>
                <img src={user.avatar} alt={user.name} />
              </td>
              <td>{user.level}</td>
              <td>
                <img src={user.animal_avatar} alt="animal_avatar" />
              </td>
              <td>❤{user.receivedLikes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Delete;
