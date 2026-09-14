export type SkillType = {
  id: number;
  name: string;
  description: string;
  avatar_path: string;
  movie_path: string;
  category: string;
  required_level: number;
  point: number; 
  skill_tips: SkillTipType[]; 
}

type SkillTipType = {
  id: number,
  user_id: number,
  skill_id: number,
  text: string,
  created_at: Date,
}
