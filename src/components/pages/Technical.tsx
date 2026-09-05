import SkillCard from "../common/cards/SkillCard";
import classes from "./PageCommon.module.css";
import { useState, useEffect } from "react";
import ScrollToTop from "../common/button/ScrollButton";
import { fetchSkills } from "../../api/skills";
import Button from "../common/button/Button";
import Loading from "../common/modal/Loading";
import type { SkillType } from "../common/type/skill";

function Technical() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [allSkills, setAllSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        const data = await fetchSkills();
        setSkills(data);
        setAllSkills(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const filterBasicSkills = () => {
    const filterdBasic = allSkills.filter((skill) => skill.required_level <= 25);
    setSkills(filterdBasic);
  };

  const filterSoloSkills = () => {
    const filterdSolo = allSkills.filter(
      (skill) => skill.category=== 'ソロ中級',
    );
    setSkills(filterdSolo);
  };

  const filterPairSkills = () => {
    const filterdPair = allSkills.filter(
      (skill) => skill.category === "ペア",
    );
    setSkills(filterdPair);
  };

  return (
    <div className={classes.contentsWrapper}>
      {loading && <Loading />}
      <h1>わざ一覧</h1>
      <div className={classes.sortbuttonWrapper}>
        <Button variant="outline" onClick={filterBasicSkills}>
          基礎
        </Button>
        <Button onClick={filterSoloSkills} variant="outline" color="primary">
          ソロ中級
        </Button>
        <Button onClick={filterPairSkills} variant="outline">
          ペア
        </Button>
      </div>
      <div className={classes.cardContainer}>
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
          />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Technical;
