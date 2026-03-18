import { serverFetch } from "@/lib/api/serverFetch";
import type { PagedResult } from "@/lib/types/PagedResult";
import type { AdminOrder } from "@/lib/types/adminOrder";
import AdminOrdersManager from "./AdminOrdersManager";

export default async function AdminOrdersPage() {
    const res = await serverFetch("/admin/orders?page=1&pageSize=8");

    if (!res.ok) {
        throw new Error("No se pudieron cargar las órdenes.");
    }

    const initialOrders: PagedResult<AdminOrder> = await res.json();

    return <AdminOrdersManager initialOrders={initialOrders} />;
}