import classes from "./Modal.module.css";
import Button from "../button/Button";

function Modal({ isOpen, isColorOpen, isItemOpen, children, onClose }) {
  if (!isOpen && !isColorOpen && !isItemOpen) return null;

  return (
    <div className={classes.ovarlay} onClick={onClose}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div> {children}</div>

        <div className={classes.closeButton}>
          <Button onClick={onClose}>とじる</Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
