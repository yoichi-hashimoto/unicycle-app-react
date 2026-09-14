export async function fetchAvatars() {
    const response = await fetch("http://127.0.0.1:8000/api/avatars");

    if (!response.ok) {
        throw new Error("Failed to fetch avatars")
    }
    return response.json();
}