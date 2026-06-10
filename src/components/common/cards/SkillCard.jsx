import classes from './SkillCard.module.scss'
import { Link } from 'react-router-dom';

function SkillCard({ skill }) {
    return (
      <div className={classes.cardContainer}>
        <div className={classes.levelDisplay}>
          <div>
            <p className={classes.level}>{skill.level}</p>
          </div>
          <p className={classes.levelName}>{skill.name}</p>
        </div>
        <div className={classes.technicalImg}>
          <img src="" alt="技の写真" />
        </div>
        <div className={classes.detailButton}>
          <Link className={classes.link} variant="primary" to={skill.url}>
            説明
          </Link>
        </div>
      </div>
    );
}

export default SkillCard;