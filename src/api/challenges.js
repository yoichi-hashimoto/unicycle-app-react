export async function fetchChallenges() {
    const response = await fetch("http://127.0.0.1:8000/api/challenges");

    if (!response.ok) {
        throw new Error("Failed to fetch challenges")
    }

    const data = await response.json();
    return data.data;
}