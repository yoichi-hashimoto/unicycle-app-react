import classes from "./Delete.module.css";
import { useState, useEffect } from "react";
import { fetchUsers } from "../../../api/users";
import axios from "../../../api/axios";

function Delete() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUserList);
  }, []);
  const showAleart = () => {
    return window.confirm("本当に削除しますか？");
  };

  const handleDelete = async (id) => {
    const isConfirmed = showAleart();
    if (isConfirmed) {
      await axios.delete(`/api/users/${id}`);
      setUserList((users) => users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className={classes.tableContainer}>
      <h1>メンバー管理</h1>
      <table className={classes.deleteTable}>
        <thead>
          <tr>
            <th>削除</th>
            <th>ID</th>
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
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <img src={user.avatar_path} alt={user.name} />
              </td>
              <td>{user.current_level}</td>
              <td>
                <img src={user.current_animal?.avatar_path} alt="animal_avatar" />
              </td>
              <td>❤{user.received_likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Delete;
