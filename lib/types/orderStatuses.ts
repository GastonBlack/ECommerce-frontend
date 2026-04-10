export const ORDER_STATUSES = {
    AWAITING_PAYMENT: "AwaitingPayment",
    PAID: "Paid",
    PREPARING: "Preparing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
} as const;

export type OrderStatus =
    (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];