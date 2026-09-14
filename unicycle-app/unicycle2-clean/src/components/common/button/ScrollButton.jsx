import classes from "./ScrollButton.module.css";
import { useState, useEffect } from "react";

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
      const hundleScroll = () => {
      setIsVisible(window.scrollY > 300);
      };
    window.addEventListener("scroll", hundleScroll);
    return () => {
      window.removeEventListener("scroll", hundleScroll);

      hundleScroll();
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button className={classes.scrollToTopButton} onClick={scrollToTop}>
      ↑
    </button>
  );
}

export default ScrollToTop;
