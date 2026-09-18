export async function fetchColors() {
    const response = await fetch("https://api.unicircle-jp.com/api/colors", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
        throw new Error('エラーです：', Error);
    }

    return response.json();
}