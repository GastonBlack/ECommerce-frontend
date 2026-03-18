import { ORDER_STATUSES, type OrderStatus } from "@/lib/types/orderStatuses";

export function normalizeOrderStatus(status?: string): OrderStatus | null {
    const s = (status ?? "").trim().toLowerCase();

    switch (s) {
        case "pending":
            return ORDER_STATUSES.PENDING;
        case "paid":
            return ORDER_STATUSES.PAID;
        case "preparing":
            return ORDER_STATUSES.PREPARING;
        case "shipped":
            return ORDER_STATUSES.SHIPPED;
        case "delivered":
            return ORDER_STATUSES.DELIVERED;
        case "cancelled":
            return ORDER_STATUSES.CANCELLED;
        default:
            return null;
    }
}

export function canTransitionOrderStatus(
    currentStatus?: string,
    nextStatus?: string
): boolean {
    const current = normalizeOrderStatus(currentStatus);
    const next = normalizeOrderStatus(nextStatus);

    if (!current || !next) return false;

    switch (current) {
        case ORDER_STATUSES.PENDING:
            return next === ORDER_STATUSES.CANCELLED;

        case ORDER_STATUSES.PAID:
            return (
                next === ORDER_STATUSES.PREPARING ||
                next === ORDER_STATUSES.CANCELLED
            );

        case ORDER_STATUSES.PREPARING:
            return (
                next === ORDER_STATUSES.SHIPPED ||
                next === ORDER_STATUSES.CANCELLED
            );

        case ORDER_STATUSES.SHIPPED:
            return next === ORDER_STATUSES.DELIVERED;

        case ORDER_STATUSES.DELIVERED:
        case ORDER_STATUSES.CANCELLED:
            return false;

        default:
            return false;
    }
}

export function getNextOrderStatuses(status?: string): OrderStatus[] {
    const current = normalizeOrderStatus(status);

    if (!current) return [];

    switch (current) {
        case ORDER_STATUSES.PENDING:
            return [ORDER_STATUSES.CANCELLED];

        case ORDER_STATUSES.PAID:
            return [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED];

        case ORDER_STATUSES.PREPARING:
            return [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED];

        case ORDER_STATUSES.SHIPPED:
            return [ORDER_STATUSES.DELIVERED];

        case ORDER_STATUSES.DELIVERED:
        case ORDER_STATUSES.CANCELLED:
            return [];

        default:
            return [];
    }
}

export function getOrderStatusUI(status?: string) {
    const normalized = normalizeOrderStatus(status);

    switch (normalized) {
        case ORDER_STATUSES.PAID:
            return {
                value: ORDER_STATUSES.PAID,
                label: "Pagado",
                badge: "bg-green-50 text-green-700 border-green-200",
            };

        case ORDER_STATUSES.PREPARING:
            return {
                value: ORDER_STATUSES.PREPARING,
                label: "En preparación",
                badge: "bg-blue-50 text-blue-700 border-blue-200",
            };

        case ORDER_STATUSES.SHIPPED:
            return {
                value: ORDER_STATUSES.SHIPPED,
                label: "Enviado",
                badge: "bg-purple-50 text-purple-700 border-purple-200",
            };

        case ORDER_STATUSES.DELIVERED:
            return {
                value: ORDER_STATUSES.DELIVERED,
                label: "Entregado",
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            };

        case ORDER_STATUSES.CANCELLED:
            return {
                value: ORDER_STATUSES.CANCELLED,
                label: "Cancelado",
                badge: "bg-red-50 text-red-700 border-red-200",
            };

        case ORDER_STATUSES.PENDING:
        default:
            return {
                value: ORDER_STATUSES.PENDING,
                label: "Pendiente",
                badge: "bg-orange-50 text-orange-700 border-orange-200",
            };
    }
}

export function getOrderStatusActionLabel(status: OrderStatus): string {
    switch (status) {
        case ORDER_STATUSES.CANCELLED:
            return "Cancelar pedido";
        case ORDER_STATUSES.PREPARING:
            return "Pasar a preparación";
        case ORDER_STATUSES.SHIPPED:
            return "Marcar como enviado";
        case ORDER_STATUSES.DELIVERED:
            return "Marcar como entregado";
        case ORDER_STATUSES.PAID:
            return "Marcar como pagado";
        case ORDER_STATUSES.PENDING:
        default:
            return "Marcar como pendiente";
    }
}

export function isFinalOrderStatus(status?: string): boolean {
    const normalized = normalizeOrderStatus(status);

    return (
        normalized === ORDER_STATUSES.DELIVERED ||
        normalized === ORDER_STATUSES.CANCELLED
    );
}