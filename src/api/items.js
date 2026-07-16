import axios from "./axios";

export async function fetchItems() {
    const response = await axios.get("/api/items");
    return response.data;
}
