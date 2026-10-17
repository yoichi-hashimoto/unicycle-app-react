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
  unread_tip_count: number;
  is_basic?: boolean;
  is_cleared?: boolean;
  is_available?: boolean;
  is_current?: boolean;
  locked_reason?: string | null;
  prerequisite_ids?: number[];
  prerequisite_names?: string[];
  required_pair_skills?: number;
  roadmap_order?: number;
  success_score?: number;
}

type SkillTipType = {
  id: number,
  user_id: number,
  skill_id: number,
  text: string,
  created_at: Date,
  parent_id?: number | null,
  received_likes?: number,
  is_liked_by_me?: boolean,
}
