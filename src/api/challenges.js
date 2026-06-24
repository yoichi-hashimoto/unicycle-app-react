export async function fetchChallenges() {
    const response = await fetch("http://localhost:8000/api/challenges",
        {
            credentials: "include",
            headers: {
                Accept:"application/json"
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch challenges")
    }

    const data = await response.json();
    return data.data;
}