export async function fetchAvatars() {
    const response = await fetch("http://localhost:8000/api/avatars");

    if (!response.ok) {
        throw new Error("Failed to fetch avatars")
    }
    return response.json();
}