import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import { Link } from "react-router-dom";
import classes from "./PageCommon.module.css";
import { useAuthStore } from "../../stores/authStore";
import ItemCard from "../common/cards/ItemCard";
import { fetchItems } from "../../api/items";
import { useState, useEffect } from "react";
import type { ItemType } from "../common/type/item";
import Modal from "../common/modal/Modal";
import Loading from "../common/modal/Loading";
import axios from "../../api/axios";
import Button from "../common/button/Button";
import { fetchPoints } from "../../api/points";
import Toast from "../common/modal/Toast";

type UserItemType = {
  item_id: number;
};

type UserPointType = {
  user_id: number;
  total_points: number;
};

type ToastType = {
  message: string;
  type: "success" | "fail";
};

function Profile() {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<ItemType[]>([]);
  const [userItems, setUserItems] = useState<UserItemType[]>([]);
  const [userPoints, setUserPoints] = useState<UserPointType | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimalEvolution, setShowAnimalEvolution] = useState(false);
  const [phase, setPhase] = useState<"old" | "fadeOut" | "new" | "jump">("old");

  function showToast(message: string, type: "success" | "fail" = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  useEffect(() => {
    if (
      user.current_animal &&
      user.last_seen_animal &&
      user.current_animal.id !== user.last_seen_animal.id
    ) {
      setShowAnimalEvolution(true);
    }
  }, [user]);

  useEffect(() => {
    if (!showAnimalEvolution) return;
    if (!user?.id || !user.current_animal?.id) return;

    const userId = user.id;
    const currentAnimalId = user.current_animal.id;

    const timer1 = setTimeout(() => {
      setPhase("fadeOut");
    }, 1200);

    const timer2 = setTimeout(() => {
      setPhase("new");
    }, 2200);

    const timer3 = setTimeout(() => {
      setPhase("jump");
    }, 3000);

    const timer4 = setTimeout(async () => {
      setShowAnimalEvolution(false);

      try {
        const response = await axios.patch(`/api/users/${userId}/animal-seen`, {
          last_seen_animal_id: currentAnimalId,
        });
        console.log("PATCH response:", response.data);
      } catch (error) {
        console.error("animal-seen update failed", error);
      }
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [showAnimalEvolution, user?.id, user?.current_animal?.id]);

  useEffect(() => {
    async function loadPoints() {
      try {
        if (!user) return;
        const points = await fetchPoints();
        if (!points) {
          return;
        }
        const usersPoint = points.find(
          (point: { user_id: number }) => point.user_id === user.id,
        );
        setUserPoints(usersPoint);
      } catch (error) {
        console.error("error", error);
      }
    }
    loadPoints();
  }, [user]);

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
    if (user) loadItems();
  }, [user]);

  const handlePurchase = async (selectedItem: ItemType) => {
    if (!user) return;
    const isConfirmed = window.confirm(
      `本当に${selectedItem.name}を購入しますか？`,
    );
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await axios.get("./sanctum/csrf-cookie");
      await axios.post("./api/user_item", {
        user_id: user.id,
        item_id: selectedItem.id,
      });
      setUserItems((prev) => [
        ...prev,
        {
          item_id: selectedItem.id,
        },
      ]);
      setIsOpen(false);
    } catch (error) {
      showToast("ポイントが足りません！", "fail");
      console.error("アイテムの購入に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ownedItemIds = userItems.map((item) => item.item_id);
  if (!user) {
    return <p>読み込み中</p>;
  }

  return (
    <div className={classes.contentsWrapper}>
      {toast?.message && (
        <div>
          <Toast type={toast.type} message={toast.message}></Toast>
        </div>
      )}
      {showAnimalEvolution && (
        <div className={classes.evolutionOverlay}>
          <div className={classes.evolutionContent}>
            {phase === "old" || phase === "fadeOut" ? (
              <img
                src={user.last_seen_animal.avatar_path}
                alt={user.last_seen_anima.name}
                className={
                  phase === "fadeOut"
                    ? classes.animalFadeOut
                    : classes.animalOld
                }
              />
            ) : (
              <img
                src={user.current_animal.avatar_path}
                alt={user.current_animal.name}
                className={
                  phase === "jump" ? classes.animalJump : classes.animalFadeIn
                }
              />
            )}

            {phase === "jump" && (
              <h2 style={{ color: "white" }}>
                おめでとう！{user.current_animal.name}に進化しました！
              </h2>
            )}
          </div>
        </div>
      )}
      {isLoading && <Loading />}
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
        <ItemCard
          items={items}
          ownedItemIds={ownedItemIds}
          points={userPoints?.total_points ?? 0}
        />
      </div>
      <div style={{ textAlign: "center", margin: "3rem" }}>
        <Link to="/edit" className={classes.linkButton}>
          プロフィールを変更する
        </Link>
      </div>
      <div style={{ textAlign: "center", margin: "3rem" }}>
        <Button variant={"outline"} onClick={() => setIsOpen(true)}>
          アイテムを購入する
        </Button>
      </div>
      <div>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <div className={classes.itemModalContainer}>
            {items.map((item) => (
              <div className={classes.itemContainer} key={item.id}>
                <button
                  key={item.id}
                  type="button"
                  disabled={isLoading || ownedItemIds.includes(item.id)}
                  onClick={() => handlePurchase(item)}
                  className={`${classes.usersItems} ${ownedItemIds.includes(item.id) ? classes.ownedItem : ""}`}
                >
                  <img
                    src={item.avatar_path}
                    alt={item.name}
                    className={classes.itemsImage}
                  />
                </button>
                <div></div>
                <p className={classes.itemName}>{item.name}</p>
                {ownedItemIds.includes(item.id) ? (
                  <p className={classes.purchased}>購入済み</p>
                ) : (
                  <p className={classes.requiredPoint}>
                    {item.required_point}ポイント
                  </p>
                )}
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
