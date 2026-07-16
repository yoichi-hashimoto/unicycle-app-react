import axios from "./axios";

export async function fetchUser(id) {
    const response = await axios.get(`/api/users/${id}`);
    return response.data.data;
}
