import SkillCard from '../common/cards/SkillCard';
import classes from './PageCommon.module.css';
import { useState, useEffect } from 'react';
import ScrollToTop from '../common/button/ScrollButton';
import { fetchSkills } from '../../api/skills';
import Modal from '../common/modal/Modal'

function Technical() {
  const [isOpen, setIsOpen] = useState(false);

  const [skills, setSkills] = useState([0])

  useEffect(() => {
    fetchSkills().then((data) => {
      console.log(data);
      setSkills(data);
    })
  }, [])


  const [selectedSkill, setSelecterSkill] = useState();
  const hundleSkill = (e) => {
    const skillId = Number(e.target.value)
    console.log(skillId);
    const skill = skills.find((skill) => skill.id === skillId)

    setSelecterSkill(skill);
  }

    return (
      <div className={classes.contentsWrapper}>
        <h1 >わざ一覧</h1>
        <div className={classes.cardContainer}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} value={skill.id} onChange={hundleSkill} />
          ))}
        </div>
        <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
          <div>
            <p>ttt</p>
          </div>
        </Modal>
        <ScrollToTop/>
      </div>
    );
}

export default Technical;