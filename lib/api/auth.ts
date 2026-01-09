import api from "./axios";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });

        const { token, userId, email: userEmail, fullName } = res.data;

        // Guardar sesion
        localStorage.setItem("token", token);
        localStorage.setItem("userName", fullName);

        return { userId, userEmail, fullName };
    },

    async register(fullName: string, email: string, password: string) {
        const res = await api.post("/auth/register", { fullName, email, password });

        const { token, userId, email: userEmail, fullName: name } = res.data;

        // Guarda sesion para evitar que el usuario se registre y tenga que volver a loguearse.
        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);

        return { userId, userEmail, fullName: name };
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
    },
};
