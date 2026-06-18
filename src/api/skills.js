export async function fetchSkills() {
    const response = await fetch(`http://127.0.0.1:8000/api/skills/`)
    if (!response.ok) {
        throw new Error("Fail to fetch user");
    }
    return response.json();
}