import axios from "./axios";

export async function fetchPoints() {
  const response = await axios.get("/api/points");

  return response.data.data;
}
