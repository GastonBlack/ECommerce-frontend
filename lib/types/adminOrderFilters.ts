import type { OrderStatus } from "./orderStatuses";

export type AdminOrderFilters = {
    search: string;
    status: OrderStatus | "";
    dateFrom: string;
    dateTo: string;
};