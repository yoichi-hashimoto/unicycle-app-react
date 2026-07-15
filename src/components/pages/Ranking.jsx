import { useState, useEffect } from "react";
import MemberCard from "../common/cards/MemberCard";
import Button from "./../common/button/Button";
import classes from "./PageCommon.module.css";
import { fetchUsers } from "../../api/users";
import Loading from "../common/modal/Loading";

function Ranking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortByCreated = () => {
    const sortedMembers = [...users].sort(
      (a, b) => b.id - a.id,
    );
    setUsers(sortedMembers);
  };

  const sortByLevel = () => {
    const sortedMembers = [...users].sort(
      (a, b) => b.current_level - a.current_level,
    );
    setUsers(sortedMembers);
  };

  const sortByLike = () => {
    const sortedMembers = [...users].sort(
      (a, b) => b.received_likes - a.received_likes,
    );
    setUsers(sortedMembers);
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const users = await fetchUsers();
        setUsers(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (!users) {
    return <Loading />;
  }

  return (
    <div className={classes.contentsWrapper}>
      {loading && <Loading />}
      <h1>ランキング</h1>
      <div className={classes.sortbuttonWrapper}>
        <Button variant="outline" onClick={sortByCreated}>新しい順</Button>
        <Button onClick={sortByLevel} variant="outline" color="primary">
          レベル順
        </Button>
        <Button onClick={sortByLike} variant="outline">
          ❤の数順
        </Button>
      </div>
      <div className={classes.cardContainer}>
        {users.map((user) => (
          <MemberCard
            key={user.id}
            member={user}
            level={user.current_level}
            skill={user.skill}
            success={user.success_score ?? null}
          />
        ))}
      </div>
    </div>
  );
}

export default Ranking;
