import axios from "./axios";

export async function fetchAvatars() {
    const response = await axios.get("/api/avatars");
    return response.data;
}
