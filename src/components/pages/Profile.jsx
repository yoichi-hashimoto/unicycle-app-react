import React from "react";
import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import { Link } from "react-router-dom";
import classes from "./PageCommon.module.css";
import { useAuthStore } from "../../stores/authStore";
import ItemCard from "../common/cards/ItemCard";
import { fetchItems } from "../../api/items";
import { useState, useEffect } from "react";

function Profile() {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      try {
        const Items = await fetchItems();
        setItems(Items);
        if (user && user.user_items) {
          setUserItems(user.user_items);
        }
      } catch (err) {
        console.error(err);
      } 
    }
    if(user)loadItems();
  }, [user]);

  const ownedItemIds = userItems.map((userItem) => userItem.item_id);
  if (!user) {
    return <p>読み込み中</p>;
  }

  return (
    <div className={classes.contentsWrapper}>
      <h1 style={{ textAlign: "center" }}>プロフィール</h1>
      <div className={classes.profileContainer}>
        <MemberCard
          member={user}
          showButton={false}
          success={user.success_score}
          level={user.current_level}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
          currentLevel={user.current_level}
        />
      </div>
      <div>
        <ItemCard items={items} ownedItemIds={ownedItemIds} />
      </div>
      <div style={{ textAlign: "center", margin: "3rem" }}>
        <Link to="/edit" className={classes.linkButton}>
          プロフィールを変更する
        </Link>
      </div>
    </div>
  );
}

export default Profile;
