import api from "./axios";

export const orderService = {

    async checkout() {
        const res = await api.post("/order/checkout");
        return res.data;
    },

    async getOrders() {
        const res = await api.get("/order");
        return res.data;
    },

    async getById(orderId: number) {
        const res = await api.get(`/order/${orderId}`);
        return res.data;
    },

};