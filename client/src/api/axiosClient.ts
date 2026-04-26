import axios from "axios";

/* API base URL from environment variables */
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosClient = axios.create({
    baseURL,
    timeout: 15000,
});

/* Attach JWT token to every authenticated request */
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* Central place for response error handling */
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);