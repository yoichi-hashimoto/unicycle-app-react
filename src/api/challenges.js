import axios from "./axios";

export async function fetchChallenges() {
    const response = await axios.get("/api/challenges");
    return response.data.data;
}
