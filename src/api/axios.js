import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json",
    },
});

export default axios;
