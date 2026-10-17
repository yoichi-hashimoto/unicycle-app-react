import type { SkillType } from "../../components/common/type/skill";

export const roadmapGenres = [
  { name: "スピン・ターン系", description: "回る・向きを変える" },
  { name: "片足系", description: "片足で距離を伸ばす" },
  { name: "ジャンプ系", description: "回数・前進・ターンへ分岐" },
  { name: "タイヤ乗り系", description: "3mから、さらに先へ" },
  { name: "サドル操作系", description: "前出し・後ろ出しを選ぶ" },
  { name: "ペア・演技系", description: "仲間と合わせて演技へ" },
];

export const isBasicSkill = (skill: SkillType) => skill.is_basic ?? (skill.category === "基礎" && skill.required_level <= 25);
export const sortRoadmapSkills = (a: SkillType, b: SkillType) => (a.roadmap_order || a.required_level || a.id) - (b.roadmap_order || b.required_level || b.id) || a.id - b.id;
