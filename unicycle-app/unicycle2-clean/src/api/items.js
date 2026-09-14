export async function fetchItems() {
    const response = await fetch(`http://localhost:8000/api/items`, {
        credentials: "include",
        headers: {
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Fail to fetch item");
    }
    
    const data = await response.json()
    return data;
}