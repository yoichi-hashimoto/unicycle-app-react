import { z } from "zod";

export const itemSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string(),
    required_skill: z.number().int().nonnegative().nullable().optional(),
    avatar_path: z.string(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .passthrough();

export const itemsSchema = z.array(itemSchema);

export type Item = z.infer<typeof itemSchema>;

export interface UserItem {
  id: number;
  item_id: number;
  is_equipped?: boolean;
  item?: Item;
}
