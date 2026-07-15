export async function fetchColors() {
    const response = await fetch('http://localhost:8000/api/colors', {
        credentials : "include",
        headers:{
            Accept:"application/json"
        }
    });

    if (!response.ok) {
        throw new Error('エラーです：', Error);
    }

    return response.json();
}