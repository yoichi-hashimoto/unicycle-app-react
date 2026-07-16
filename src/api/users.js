import axios from "./axios";

export async function fetchUsers() {
    const response = await axios.get("/api/users");
    return response.data.data;
}
