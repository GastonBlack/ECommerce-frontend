import api from "./axios";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });

        const { token, fullName } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userName", fullName);

        return { fullName };
    },


    async register(fullName: string, email: string, password: string) {
        const res = await api.post("/auth/register", { fullName, email, password });

        const { token, fullName: name } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);

        return { fullName: name };
    },


    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
    },
};
