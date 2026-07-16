import SkillCard from '../common/cards/SkillCard';
import classes from './PageCommon.module.css';
import { useState, useEffect } from 'react';
import ScrollToTop from '../common/button/ScrollButton';
import { fetchSkills } from '../../api/skills';

function Technical() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetchSkills().then((data) => {
      setSkills(data);
    })
  }, [])


    return (
      <div className={classes.contentsWrapper}>
        <h1 >わざ一覧</h1>
        <div className={classes.cardContainer}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill}/>
          ))}
        </div>
        <ScrollToTop/>
      </div>
    );
}

export default Technical;
