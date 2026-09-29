import axios from "./axios";

export async function syncBeginnerProgress(progress) {
  const response = await axios.patch("/api/user/beginner-progress", progress);
  return response.data.data ?? response.data;
}
