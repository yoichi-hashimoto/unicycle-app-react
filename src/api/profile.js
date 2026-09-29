import axios from "./axios";

export async function fetchProfileActivity() {
  const response = await axios.get("/api/profile/activity");
  return response.data;
}
