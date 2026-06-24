import classes from "./MenuModal.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuthStore } from "../../../stores/authStore";

function MenuModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  if (!isOpen) return null;
  async function handleLogout() {
    await axios.post("/logout");
    logout();
    navigate("/login");
  }

  return (
    <div onClick={onClose} className={classes.modalOverlay}>
      <div className={classes.menuModal} onClick={(e) => e.stopPropagation()}>
        <nav className={classes.menuNav}>
          <Link className={classes.link} to="/" onClick={onClose}>
            ホーム
          </Link>
          <Link className={classes.link} to="/ranking" onClick={onClose}>
            ランキング
          </Link>
          <Link className={classes.link} to="/challenge" onClick={onClose}>
            みんなのチャレンジ
          </Link>
          <Link className={classes.link} to="/profile" onClick={onClose}>
            プロフィール
          </Link>
          <button className={classes.link} onClick={handleLogout}>
            <span>ログアウト</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default MenuModal;
