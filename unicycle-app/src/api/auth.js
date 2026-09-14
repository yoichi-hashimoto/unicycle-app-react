import axios from "axios";

export async function fetchLoginUser() {
    const response = await axios.get("/api/user");

    return response.data.data ?? response.data.user ?? response.data;
}