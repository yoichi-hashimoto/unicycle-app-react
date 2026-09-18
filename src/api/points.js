export async function fetchPoints() {
  const response = await fetch("https://api.unicircle-jp.com/api/points");
  if (!response.ok) {
    throw new Error("fail to fetch points");
  }
  return response.json();
}
