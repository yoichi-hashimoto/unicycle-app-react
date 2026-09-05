export async function fetchPoints() {
  const response = await fetch("http://localhost:8000/api/points/");
  if (!response.ok) {
    throw new Error("fail to fetch points");
  }
  return response.json();
}
