export async function fetchAvatars() {
    const response = await fetch("https://api.unicircle-jp.com/api/avatars");

    if (!response.ok) {
        throw new Error("Failed to fetch avatars")
    }
    return response.json();
}