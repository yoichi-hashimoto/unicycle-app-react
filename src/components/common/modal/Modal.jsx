import classes from './Modal.module.css';
import Button  from "../button/Button";

function Modal({ isOpen,isColorOpen, children, onClose }) {
  if (!isOpen && !isColorOpen ) return null;

    return (
      <div className={classes.modalContainer}>
        {children}
        <div className={classes.closeButton}>
          <Button onClick={onClose}>とじる</Button>
        </div>
      </div>
    );
}

export default Modal;