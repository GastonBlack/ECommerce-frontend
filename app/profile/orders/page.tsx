import OrdersManager from "./MyOrdersManager";
import { serverFetch } from "@/lib/api/serverFetch";
import type { PagedResult } from "@/lib/types/PagedResult";
import type { Order } from "@/lib/types/order";

export default async function MyOrdersPage() {
    const res = await serverFetch("/order?page=1&pageSize=10");

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
    }

    const initial: PagedResult<Order> = await res.json();

    return <OrdersManager initialOrders={initial} />;
}