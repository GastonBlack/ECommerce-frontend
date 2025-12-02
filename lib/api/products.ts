import api from "./axios";

export const productService = {

    async getAll() {
        const res = await api.get("/product");
        return res.data;
    },

    async getById(id: number) {
        const res = await api.get(`/product/${id}`);
        return res.data;
    }
};