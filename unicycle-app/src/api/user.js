export async function fetchUser(id) {
    const response = await fetch(`http://localhost:8000/api/users/${id}`);

    if (!response.ok) {
        throw new Error("Fail to fetch user");
    }
    return response.json();
}
