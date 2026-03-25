import { OrderStatus } from "../types/orderStatuses";
import api from "./axios";

export const paymentsService = {

    async createPreference() {
        const res = await api.post("/payments/create-preference");
        return res.data as { orderId: number; initPoint: string; sandboxInitPoint: string; };
    },

    async getOrderStatus(orderId: number) {
        const res = await api.get(`/payments/order-status/${orderId}`);
        return res.data as {
            orderId: number;
            status: OrderStatus;
            totalAmount: number;
        };
    },
};