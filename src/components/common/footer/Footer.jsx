import classes from "./Footer.module.scss";
import { useLocation } from "react-router-dom";

function Footer() {
  const isRoadmap = useLocation().pathname === "/technical";
  return (
    <footer className={`${classes.footer} ${isRoadmap ? classes.roadmapFooter : ""}`}>
        <p>
          © 2026 おおくま一輪車クラブ. All rights reserved.
        </p>
    </footer>
  );
}

export default Footer;
