import classes from "./MenuModal.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuthStore } from "../../../stores/authStore";

function MenuModal({ isOpen, onClose }) {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
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
          {user?.is_admin && (
            <>
              <div className={classes.adminMenu}>
                <Link
                  className={classes.adminLink}
                  to="/test"
                  onClick={onClose}
                >
                  <span>テスト</span>
                </Link>
                <Link
                  className={classes.adminLink}
                  to="/register"
                  onClick={onClose}
                >
                  <span>新規登録</span>
                </Link>
                <Link
                  className={classes.adminLink}
                  to="/delete"
                  onClick={onClose}
                >
                  <span>ユーザー削除</span>
                </Link>
              </div>
            </>
          )}
          <Link className={classes.link} to="/" onClick={onClose}>
            <span>ホーム</span>
          </Link>
          <Link className={classes.link} to="/ranking" onClick={onClose}>
            <span>ランキング</span>
          </Link>
          <Link className={classes.link} to="/challenge" onClick={onClose}>
            <span>みんなのチャレンジ</span>
          </Link>
          <Link className={classes.link} to="/technical" onClick={onClose}>
            <span>わざ一覧</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link className={classes.link} to="/profile" onClick={onClose}>
                <span>プロフィール</span>
              </Link>
              <button className={classes.link} onClick={handleLogout}>
                <span>ログアウト</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MenuModal;
