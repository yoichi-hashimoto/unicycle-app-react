import axios from "./axios";

export async function fetchNotice() {
    const response = await axios.get("/api/notices");

    return response.data;
}