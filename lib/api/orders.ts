import api from "./axios";
import type { PagedResult } from "../types/PagedResult";
import type { Order } from "../types/order";

export const orderService = {
    async getOrders(params: {
        page: number;
        pageSize: number;
    }): Promise<PagedResult<Order>> {
        const res = await api.get("/order", { params });
        return res.data;
    },

    async getById(orderId: number): Promise<Order> {
        const res = await api.get(`/order/${orderId}`);
        return res.data;
    },
};