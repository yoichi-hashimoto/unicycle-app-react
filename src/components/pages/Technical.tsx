import SkillCard from "../common/cards/SkillCard";
import classes from "./PageCommon.module.css";
import { useState, useEffect } from "react";
import ScrollToTop from "../common/button/ScrollButton";
import { fetchSkills } from "../../api/skills";
import Button from "../common/button/Button";
import Loading from "../common/modal/Loading";
import type { SkillType } from "../common/type/skill";
import Modal from "../common/modal/Modal";
import {fetchUsers} from "../../api/users";
import type {UserType} from "../common/type/user";


function Technical() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [allSkills, setAllSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen,setIsOpen] =useState(false);
  const [admins,setAdmins] = useState<UserType[]>([]);

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

    useEffect(()=>{
    async function loadAdmins(){
      try{
        setLoading(true);
        const users = await fetchUsers();
        const admins = users.filter((user:any)=>user.is_admin === true);
        console.log(admins);
        setAdmins(admins);
      }catch(error){
        console.log('エラーです',error)
      }finally{
        setLoading(false);
      }}
      loadAdmins();
    },[]);

  return (
    <div className={classes.contentsWrapper}>
      {loading && <Loading />}
      <div className={classes.titleWrapper}>
        <h1>わざ一覧</h1>
      <Button onClick={()=>setIsOpen(true)}>
        テストについて
        </Button>
        <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
          <div>
            <h2>テストについて</h2>
            <div className={classes.testExplain}>
              <ol >
                <li>チャレンジする「わざ」を決めて練習しよう！</li>
              <li>レベルアップなら”基礎”、アイテムゲットなら”ソロ中級”と”ペア”にチャレンジしよう）</li>
              <li>「指導者」へテストをお願いしよう！（練習日にやるのがおすすめ！）</li><li>3回成功するとレベル、ポイントをゲット！</li>
              </ol></div>
              <h2>指導者</h2>
              {admins.map((admin)=>(            
                <div className={classes.adminContainer}>
                <div className={classes.adminWrapper}>                  
                  <p>{admin.name}</p>
                  <img src={admin.avatar_path} className={classes.adminImage}/>
                </div>            
                </div>
              ))}
          </div>
          <p>失敗を恐れずにどんどんチャレンジしよう！</p>
        </Modal>
      </div>
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
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Technical;
