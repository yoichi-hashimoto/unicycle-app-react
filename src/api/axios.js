import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",

  withCredentials: true,

  withXSRFToken: true,

  xsrfCookieName: "XSRF-TOKEN",

  xsrfHeaderName: "X-XSRF-TOKEN",
});
export default api;