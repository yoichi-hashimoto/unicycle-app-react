export async function fetchSkills() {
    const response = await fetch(`http://localhost:8000/api/skills/`)
    if (!response.ok) {
        throw new Error("Fail to fetch user");
    }
    return response.json();
}