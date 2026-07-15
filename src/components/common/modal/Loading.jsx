import classes from "./Loading.module.css";

function Loading() {
    return (
        <div className={classes.overlay}>
            <div className={classes.animalsLine}>
                <p>読み込み中...</p>
                <img className={classes.animalImage} src="./images/animals/animals_line.png" alt="" />
            </div>
        </div>
    )
}

export default Loading;