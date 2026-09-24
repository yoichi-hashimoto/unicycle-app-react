import axios from "./axios";

export async function fetchItems() {
  const response = await axios.get(`/api/items`);
    //   credentials: "include",
    //   headers: {
    //     Accept: "application/json",
    //   },
    // });

    // if (!response.ok) {
    //     throw new Error("Fail to fetch item");
    // }
    
    // const data = await response.json()
    return response.data;
}