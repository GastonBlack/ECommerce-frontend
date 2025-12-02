import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5155/api", // Puerto temporal, cuando se haga el deploy lo cambio.
    withCredentials: false
});

// INTERCEPTOR PARA AGREGAR TOKEN
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// INTERCEPTOR PARA ERRORES
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error: ", error);
        throw error;
    }
);

export default api;