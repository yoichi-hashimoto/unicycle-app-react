import classes from './SkillCard.module.scss'
import { Link } from 'react-router-dom';
import Button from '../../common/button/Button';

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
          <Button to={skill.movie_path}>
            説明
          </Button>
        </div>
      </div>
    );
}

export default SkillCard;