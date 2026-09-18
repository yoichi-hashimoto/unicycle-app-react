export async function fetchUser(id) {
    const response = await fetch(
      `https://api.unicircle-jp.com/api/user/${id}`,
    );

    if (!response.ok) {
        throw new Error("Fail to fetch user");
    }
    return response.json();
}
