import HistoryCard from "../common/cards/HistoryCard";
import classes from "./PageCommon.module.css";
import { useState, useEffect } from "react";
import { fetchChallenges } from "../../api/challenges";
import ScrollToTop from "../common/button/ScrollButton";
import Button from "../common/button/Button";
import Loading from "../common/modal/Loading";
import type { ChallengeType } from "../common/type/challenge";
import type {UserType} from "../common/type/user";
import Modal from "../common/modal/Modal";
import {fetchUsers} from "../../api/users"


function Challenge({ showButton = true }) {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen,setIsOpen]=useState(false);
  const [admins,setAdmins]=useState<UserType[]>([]);
  const sortByLevel = () => {
    const sortedChallenge = [...challenges].sort(
      (a, b) => b.current_level - a.current_level,
    );
    setChallenges(sortedChallenge);
  };
  const sortByLike = () => {
    const likedChallenge = [...challenges].sort(
      (a, b) => b.received_likes - a.received_likes,
    );
    setChallenges(likedChallenge);
  };
  const sortByDate = () => {
    const youngerChallenge = [...challenges].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    setChallenges(youngerChallenge);
  };
  useEffect(() => {
    async function loadChallenges() {
      try {
        setLoading(true);
        const challenges = await fetchChallenges();
        setChallenges(challenges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

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
      <div className={classes.titleWrapper}>
      <h1>みんなのチャレンジ</h1>
      <Button onClick={()=>setIsOpen(true)}>
        テストについて
        </Button>
        </div>
        <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
          <div>
            <h2>テストについて</h2>
            <div className={classes.testExplain}>
              <ol >
                <li>チャレンジする「わざ」を決めて練習しよう！</li>
              <li>レベルアップなら”基礎”、アイテムゲットなら”ソロ中級”と”ペア”にチャレンジしよう）</li>
              <li>「指導者」へテストをお願いしよう！（練習日にやるのがおすすめ！）</li><li>3回成功するとレベル、ポイントをゲット！</li>
              </ol></div>
              <h2>この人にテストをおねがいしよう</h2>
              {admins.map((admin)=>(            
                <div className={classes.adminContainer}>
                <div className={classes.adminWrapper}>                  
                  <p>{admin.name}</p>
                    <img src={admin.avatar_path} className={classes.adminImage} alt={ admin.name } />
                </div>            
                </div>
              ))}
          </div>
          <p>失敗を恐れずにどんどんチャレンジしよう！</p>
        </Modal>
      {loading && <Loading />}
      <div className={classes.sortbuttonWrapper}>
        <Button variant="outline" onClick={sortByDate}>
          新しい順
        </Button>
        <Button onClick={sortByLevel} variant="outline">
          レベル順
        </Button>
        <Button onClick={sortByLike} variant="outline">
          ❤の数順
        </Button>
      </div>
      <p style={{ textAlign: "center", color: "red" }}>
        ❤を押すにはログインしてください
      </p>
      <div className={classes.challengeContainer}>
        {challenges.map((challenge) => (
          <HistoryCard key={challenge.id} history={challenge} />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Challenge;
