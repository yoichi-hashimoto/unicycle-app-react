import classes from './SkillCard.module.scss'
import { Link } from 'react-router-dom';
import Button from '../../common/button/Button';
import Modal from '../modal/Modal';
import { useState } from 'react';

function SkillCard({ skill }) {
  const [isOpen, setIsOpen] = useState(false);
  
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
          <Button onClick={()=>setIsOpen(true)}>
            説明
          </Button>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <h2>{skill.name}</h2>
            <img src={skill.avatar_path} alt="" />
            <p>{skill.description }</p>
            <button>
              <Link to = {skill.movie_path}>動画を見る</Link>
            </button>
          </div>
        </Modal>
      </div>
    );
}

export default SkillCard;
