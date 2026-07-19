import axios from "./axios";
import { itemsSchema, type Item } from "../types/item";

export async function fetchItems(): Promise<Item[]> {
    const response = await axios.get("/api/items");
    return itemsSchema.parse(response.data);
}
