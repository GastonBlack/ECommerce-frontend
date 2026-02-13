import api from "./axios";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });

        localStorage.setItem("userName", res.data.fullName);
        return { fullName: res.data.fullName };
    },

    async register(fullName: string, email: string, password: string) {
        const res = await api.post("/auth/register", { fullName, email, password });

        localStorage.setItem("userName", res.data.fullName);
        return { fullName: res.data.fullName };
    },

    async logout() {
        await api.post("/auth/logout");
        localStorage.removeItem("userName");
        window.location.href = "/";
    },
};