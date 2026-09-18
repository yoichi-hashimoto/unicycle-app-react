export async function fetchChallenges() {
    const response = await fetch("https://api.unicircle-jp.com/api/challenges", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch challenges")
    }

    const data = await response.json();
    return data.data;
}