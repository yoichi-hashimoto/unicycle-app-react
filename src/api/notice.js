export async function fetchNotice() {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || "https://api.unicircle-jp.com"}/api/notices`,
    );

    if (!response.ok) {
      throw new Error("Fail to fetch notice");
    }
    return response.json();
}
