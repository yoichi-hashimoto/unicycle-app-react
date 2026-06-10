import classes from "./Header.module.scss";
import { useState } from "react";
import MenuModal from "../modal/MenuModal";
import { Link } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
          <Link className={classes.link} to="/ranking">
            <span>ランキング</span>
          </Link>
          <Link className={classes.link} to="/challenge">
            <span>みんなのチャレンジ</span>{" "}
          </Link>
          <Link className={classes.link} to="/technical">
            <span>わざ一覧</span>
          </Link>

          <Link className={classes.link} to="/profile">
            <span>プロフィール</span>
          </Link>
          <Link className={classes.link} to="logout">
            <span>ログアウト</span>
          </Link>
        </nav>
        <button onClick={() => setIsOpen(true)} className={classes.hamburger}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MenuModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </header>
  );
}

export default Header;
