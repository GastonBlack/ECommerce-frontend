import axios from "axios";
import { notifyGlobal } from "../utils/globalNotifier";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let last429 = 0;
let csrfInitialized = false;
let csrfPromise: Promise<void> | null = null;
let csrfToken: string | null = null;

/**
 * Pide al backend un token CSRF y lo guarda en memoria.
 * El backend también emite la cookie interna antiforgery que ASP.NET necesita.
 */
async function ensureCsrfToken() {
    if (csrfInitialized && csrfToken) return;

    if (!csrfPromise) {
        // Se solicita al backend que emita la cookie Set-Cookie: XSRF-TOKEN
        csrfPromise = api
            .get("/auth/csrf")
            .then((res) => {
                csrfToken = res.data.csrfToken;
                csrfInitialized = true;
            })
            .catch((err) => {
                csrfInitialized = false;
                csrfToken = null;
                throw err;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }

    await csrfPromise;
}

/**
 * Interceptor de Solicitudes:
 * Gestiona la inyección de tokens de seguridad en métodos que modifican el estado (POST, PUT, etc.)
 */
api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method || "");

    if (isMutating) {
        // Bloquea la ejecución hasta asegurar que el cliente tiene el token necesario
        await ensureCsrfToken();

        if (csrfToken) {
            config.headers = config.headers ?? {};
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
    }

    return config;
});

/**
 * Interceptor de Respuestas:
 * Centraliza el manejo de errores globales (401, 429, fallos de Antiforgery).
 */
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const url = err.config?.url || "";

        // Manejo de expiración o desincronización del token Antiforgery
        if (status === 400 && err.response?.data?.title?.includes("Antiforgery")) {
            csrfInitialized = false;
            csrfToken = null;
        }

        // Flags para evitar lógica de redirección en endpoints de validación de identidad
        const isAuthCheck =
            url.includes("/auth/verify") ||
            url.includes("/auth/login") ||
            url.includes("/auth/register");

        // Control de Rate Limiting (429) con debounce de 3 segundos para notificaciones
        if (status === 429) {
            const now = Date.now();

            if (now - last429 > 3000) {
                notifyGlobal("Servidor saturado. Intente de nuevo en unos momentos.", "error");
                last429 = now;
            }
        }

        // Manejo de Sesión No Autorizada (401)
        if (typeof window !== "undefined" && status === 401 && !isAuthCheck) {
            // Redirección forzada al inicio si el usuario pierde la sesión
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }

        return Promise.reject(err);
    }
);

export default api;

/*
* Fuerza la limpieza del token.
*/
export const resetCsrf = () => {
    csrfInitialized = false;
    csrfToken = null;
    csrfPromise = null;
};