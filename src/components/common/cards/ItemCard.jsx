import classes from "./ItemCard.module.css";
import { useAuthStore } from "../../../stores/authStore";
import { useState,useEffect } from "react";

function ItemCard({ items, ownedItemIds,points }) {

  return (
    <>
      <div className={classes.itemContainer}>
        <div className={classes.itemTitle}>
          <h1 className={classes.title}>かくとくアイテム</h1>
          <div className={classes.getPoint}>
            <h2>{ points }</h2>
            <p>ポイント</p>
          </div>
        </div>
        <div className={classes.itemGroup}>
          {items.map((item) => {
            const owned = ownedItemIds.includes(item.id);
            return (
              <div key={item.id} className={classes.itemWrapper}>
                {owned ? (
                  <>
                    <img
                      src={item.avatar_path}
                      className={classes.itemAvatar}
                      key={item.id}
                    />
                    <p>{item.name}</p>
                  </>
                ) :
                  (
                  <div className={classes.locked}></div>
                  )
                }
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ItemCard;
