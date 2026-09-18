export async function fetchUsers() {
    const response = await fetch("https://api.unicircle-jp.com/api/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.data;
}