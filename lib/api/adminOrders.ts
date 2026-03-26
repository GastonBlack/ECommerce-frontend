import api from "./axios";
import type { PagedResult } from "../types/PagedResult";
import type { AdminOrder } from "../types/adminOrder";
import type { OrderStatus } from "../types/orderStatuses";

export const adminOrderService = {
    async getOrders(params: {
        page: number;
        pageSize: number;
        status?: OrderStatus | "";
        search?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<PagedResult<AdminOrder>> {
        const res = await api.get("/admin/orders", { params });
        return res.data;
    },

    async getById(orderId: number): Promise<AdminOrder> {
        const res = await api.get(`/admin/orders/${orderId}`);
        return res.data;
    },

    async updateStatus(orderId: number, status: OrderStatus): Promise<void> {
        await api.patch(`/admin/orders/${orderId}/status`, { status });
    },
};