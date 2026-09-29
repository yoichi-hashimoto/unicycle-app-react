import axios from "./axios";

export async function fetchUsers(includeGuardians = false) {
    const response = await axios.get("/api/users", {
        params: includeGuardians ? { include_guardians: 1 } : undefined,
    });

    return response.data.data;
}
