export async function fetchNotice() {
    const response = await fetch('http://localhost:8000/api/notices/');
    if (!response.ok) {
        throw new Error("fail to fetch notice");
    }
    return response.json();
}