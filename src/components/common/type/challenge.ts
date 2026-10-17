export type ChallengeType = {
  id: number;
  club_name?: string | null;
  user_id: string;
  skill_id: number;
  success_score: number;
  current_level: number;
  created_at: any;
  received_likes: number;
};
