import axios from "./axios";

export async function fetchSkills() {
    const response = await axios.get("/api/skills");
    return response.data;
}
