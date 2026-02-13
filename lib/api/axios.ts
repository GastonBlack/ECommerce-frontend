import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5155/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const url = err.config?.url || "";

        const isAuthCheck =
            url.includes("/auth/verify") ||
            url.includes("/auth/login") ||
            url.includes("/auth/register");

        if (typeof window !== "undefined" && status === 401 && !isAuthCheck) {
            window.location.href = "/";
        }

        return Promise.reject(err);
    }
);

export default api;