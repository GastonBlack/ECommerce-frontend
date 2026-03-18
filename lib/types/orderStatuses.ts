export const ORDER_STATUSES = {
    PENDING: "Pending",
    PAID: "Paid",
    PREPARING: "Preparing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
} as const;

export type OrderStatus =
    (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];