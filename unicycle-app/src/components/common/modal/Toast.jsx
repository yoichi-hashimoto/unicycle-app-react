import classes from "./Toast.module.css";

function Toast({ message, type = "error" }) {
  if (!message) return null;

  return (
    <>
      <div className={classes.messageContainer}>
        <p className={`${classes.toast} ${classes[type]}`}>{message}</p>
      </div>
    </>
  );
}

export default Toast;
