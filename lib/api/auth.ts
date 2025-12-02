import api from "./axios";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });
        const { token, userId, email: userEmail } = res.data;

        //  Guardar token
        localStorage.setItem("token", token);

        return { userId, userEmail };
    },

    async register(fullName: string, email: string, password: string) {
        const res = await api.post("/auth/register", {
            fullName,
            email,
            password
        });

        const { token, userId, email: userEmail } = res.data;

        localStorage.setItem("token", token);

        return { userId, userEmail };
    },

    logout() {
        localStorage.removeItem("token");
    }
}