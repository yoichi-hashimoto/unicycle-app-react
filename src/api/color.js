import axios from "./axios";

export async function fetchColors() {
    const response = await axios.get("/api/colors");
    return response.data;
}
