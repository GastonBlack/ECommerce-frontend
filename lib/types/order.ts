import type { OrderStatus } from "./orderStatuses";

export type OrderItem = {
    productId: number;
    productName: string;
    priceAtPurchase: number;
    quantity: number;
};

export type Order = {
    orderId: number;
    totalAmount: number;
    createdAt: string;
    status: OrderStatus;
    items: OrderItem[];
};