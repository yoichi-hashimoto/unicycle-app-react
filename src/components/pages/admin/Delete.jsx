import classes from "./Delete.module.css";
import { useState, useEffect } from "react";
import { fetchUsers } from "../../../api/users";
import Loading from "../../common/modal/Loading";
import Toast from "../../common/modal/Toast";
import axios from "../../../api/axios";

function Delete() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  
  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null)
    },2500)}

  useEffect(() => {
    fetchUsers().then((data) =>
      setUserList(data));
  }, []);
  const showAleart = () => {
    return window.confirm("本当に削除しますか？");
  };

  const handleDelete = async (id) => {
    const isConfirmed = showAleart();
    if (isConfirmed) {
      try {
        setLoading(true);
        await axios.get("./sanctum/csrf-cookie");
        await axios.delete(`./api/users/${id}`);
        setUserList((prevList) => prevList.filter((user) => user.id !== id));
        showToast('削除しました', "success");
      } catch (error) {
        showToast('失敗しました', "error");
      } finally {
        setLoading(false);
      } 
    } else {
      console.log("キャンセルされました");
    }
  };

  const handleResetPassword = async (id) => {
      const isConfirmed = window.confirm('本当にリセットしますか？')
      if(!isConfirmed) return;
    try {
      console.log(id);
      setLoading(true);
      
      await axios.get("./sanctum/csrf-cookie");
      await axios.patch(`./api/users/${id}/reset-password`);
      showToast('リセットしました', "success");
    } catch (error) {
      showToast('失敗しました', "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={classes.tableContainer}>
      {loading && <Loading />}
      {toast && (
        <Toast message={toast.message} type={toast.type}/>
      )}
      <h1>メンバー管理</h1>
      <table className={classes.deleteTable}>
        <thead>
          <tr>
            <th>削除</th>
            <th>パスワード初期化</th>
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
              <td>
                <button onClick={()=>handleResetPassword(user.id)}>初期化する</button>
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <img src={user.avatar_path} alt={user.name} />
              </td>
              <td>{user.current_level}</td>
              <td>
                <img src={user.current_animal.avatar_path} alt="animal_avatar" />
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
