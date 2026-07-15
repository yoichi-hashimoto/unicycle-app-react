import classes from "./ItemCard.module.css";

function ItemCard({ items, ownedItemIds }) {
  return (
    <>
      <div className={classes.itemContainer}>
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
              ) : (
                <div className={classes.locked}>?</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ItemCard;
