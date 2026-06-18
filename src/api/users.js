export async function fetchUsers() {
    const response = await fetch("http://127.0.0.1:8000/api/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.data;
}