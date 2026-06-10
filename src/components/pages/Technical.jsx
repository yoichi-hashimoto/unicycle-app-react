import SkillCard from '../common/cards/SkillCard'

const skills = [{
    id: 1,
    name: "片足走行",
    level:5
}, {
    id: 2,
    name: "アイドリング",
    level:10,
}]

function Technical() {
    return (
      <div style={{ margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>わざ一覧</h2>
        <div style={{ display: "flex" }}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    );
}

export default Technical;