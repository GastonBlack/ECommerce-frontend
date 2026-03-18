import type { OrderItem } from "./order";
import type { OrderStatus } from "./orderStatuses";

export type AdminOrder = {
    orderId: number;
    totalAmount: number;
    status: OrderStatus;
    totalItems: number;
    createdAt: string;
    userId: number;
    userName: string;
    userEmail: string;
    items: OrderItem[];
};