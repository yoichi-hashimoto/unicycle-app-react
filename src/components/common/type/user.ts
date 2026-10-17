export type UserType =  {
    id: number;
    name: string;
    club_name?: string | null;
    color_id: number;
    user_avatar_id: number;
    role: "member" | "admin" | "gurdian";
    avatar_path:string;
    current_level: number;
    equipped_item_id: number;
    received_likes: number;
    success_score: number;
    skill_name: string;
}
