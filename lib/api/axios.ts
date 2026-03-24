import axios from "axios";
import { notifyGlobal } from "../utils/globalNotifier";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let last429 = 0;

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const url = err.config?.url || "";

        const isAuthCheck =
            url.includes("/auth/verify") ||
            url.includes("/auth/login") ||
            url.includes("/auth/register");

        // RATE LIMIT
        if (status === 429) {
            const now = Date.now();

            // Solo muestra la notificación si pasaron más de 3 segundos desde la última.
            if (now - last429 > 3000) {
                notifyGlobal("Demasiadas peticiones. Esperá unos segundos.", "error");
                last429 = now;
            }
        }

        // UNAUTHORIZED
        if (typeof window !== "undefined" && status === 401 && !isAuthCheck) {
            window.location.href = "/";
        }

        return Promise.reject(err);
    }
);

export default api;