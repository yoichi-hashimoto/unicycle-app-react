export async function fetchSkills() {
    const response = await fetch(`https://api.unicircle-jp.com/api/skills`);
    if (!response.ok) {
        throw new Error("Fail to fetch user");
    }
    return response.json();
}