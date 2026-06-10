import classes from "./MenuModal.module.css";
import { Link } from "react-router-dom";

function MenuModal({ isOpen, onClose}) {
  if (!isOpen) return null;
  
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
          <Link className={classes.link} to="/logout" onClick={onClose}>
            ログアウト
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default MenuModal;
