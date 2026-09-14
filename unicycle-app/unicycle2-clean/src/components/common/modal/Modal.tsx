import classes from "./Modal.module.css";
import Button from "../button/Button";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  isColorOpen?: boolean;
  isItemOpen?: boolean;
  children: ReactNode;
  onClose?: ()=>void;
}

function Modal({ isOpen, children, onClose }:ModalProps) {
  if (!isOpen) return null;

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
