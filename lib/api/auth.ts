import api from "./axios";
import { resetCsrf } from "./axios";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });

        // Limpia CSRF viejo.
        resetCsrf();

        localStorage.setItem("userName", res.data.fullName);
        return { fullName: res.data.fullName };
    },

    async register(fullName: string, email: string, password: string) {
        const res = await api.post("/auth/register", { fullName, email, password });

        // Limpia CSRF viejo.
        resetCsrf();

        localStorage.setItem("userName", res.data.fullName);
        return { fullName: res.data.fullName };
    },

    async logout() {
        await api.post("/auth/logout");
        // Limpia CSRF viejo.
        resetCsrf();
        localStorage.removeItem("userName");
    },
};