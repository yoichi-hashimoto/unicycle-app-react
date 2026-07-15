import classes from "./Header.module.scss";
import { useState } from "react";
import MenuModal from "../modal/MenuModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuthStore } from "../../../stores/authStore";

function Header() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  async function handleLogout() {
    await axios.post("/logout");
    logout();
    navigate("/login");
  }

  return (
    <header className={classes.header}>
      <div className={classes.titleContainer}>
        <p>一輪車レベル管理アプリ</p>
        <Link to="/" className={classes.appTitle}>
          Uni-Circle
        </Link>
      </div>
      <div className={classes.links}>
        <nav className={classes.nav}>
          {user?.is_admin && (
            <>
              <div className={classes.adminMenu}>
              <Link className={classes.adminLink} to="/test">
                <span>テスト</span>
              </Link>
              <Link className={classes.adminLink} to="/register">
                <span>新規登録</span>
              </Link>
              <Link className={classes.adminLink} to="/delete">
                <span>ユーザー削除</span>
              </Link></div>
            </>
          )}

          <Link className={classes.link} to="/ranking">
            <span>ランキング</span>
          </Link>
          <Link className={classes.link} to="/challenge">
            <span>みんなのチャレンジ</span>{" "}
          </Link>
          <Link className={classes.link} to="/technical">
            <span>わざ一覧</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link className={classes.link} to="/profile">
                <span>プロフィール</span>
              </Link>
              <button className={classes.link} onClick={handleLogout}>
                <span>ログアウト</span>
              </button>
            </>
          )}
        </nav>
        <button onClick={() => setIsOpen(true)} className={classes.hamburger}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MenuModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}

export default Header;
