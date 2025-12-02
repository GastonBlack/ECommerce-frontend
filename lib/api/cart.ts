import api from "./axios";

export const cartService = {
    async getCart() {
        const res = await api.get("/cart");
        return res.data;
    },

    async add(productId: number, quantity: number) {
        const res = await api.post("/cart/add", { productId, quantity });
        return res.data;
    },

    async update(cartItemId: number, quantity: number) {
        const res = await api.put(`/cart/update/${cartItemId}`, { quantity });
        return res.data;
    },

    async remove(cartItemId: number) {
        const res = await api.delete(`/cart/remove/${cartItemId}`);
        return res.data;
    },

    async clear() {
        const res = await api.delete("/cart/clear");
        return res.data;
    },
}