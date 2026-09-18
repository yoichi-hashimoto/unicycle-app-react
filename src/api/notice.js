export async function fetchNotice() {
    const response = await fetch("https://api.unicircle-jp.com/api/notices");
    if (!response.ok) {
        throw new Error("fail to fetch notice");
    }
    return response.json();
}