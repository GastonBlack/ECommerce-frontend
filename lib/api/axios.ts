import axios from "axios";
import { notifyGlobal } from "../utils/globalNotifier";

/**
 * Configuración de instancia base de Axios.
 * Se habilitan cookies (withCredentials) y el soporte para tokens XSRF.
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    // Axios extrae automáticamente el valor de 'xsrfCookieName' 
    // y lo envía en el header 'xsrfHeaderName' en peticiones de mutación.
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Variables de estado para control de flujo y Rate Limiting
let last429 = 0;
let csrfInitialized = false;
let csrfPromise: Promise<void> | null = null;

/**
 * Garantiza la presencia de la cookie de seguridad CSRF antes de proceder.
 */
async function ensureCsrfToken() {
    if (csrfInitialized) return;

    if (!csrfPromise) {
        // Se solicita al backend que emita la cookie Set-Cookie: XSRF-TOKEN
        csrfPromise = api.get("/auth/csrf")
            .then(() => {
                csrfInitialized = true;
                console.debug("Seguridad: CSRF Token sincronizado.");
            })
            .catch((err) => {
                console.error("Seguridad: Fallo al inicializar CSRF.", err);
                csrfInitialized = false;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }

    return csrfPromise;
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

        /**
         * Refuerzo de sincronización manual:
         * En escenarios de alta concurrencia o estados de limpieza de cookies, 
         * se fuerza la lectura del DOM para asegurar que el Header esté actualizado.
         */
        if (typeof document !== "undefined") {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
            if (match && config.headers) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2]);
            }
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