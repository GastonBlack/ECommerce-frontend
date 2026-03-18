"use client";

import { useCallback, useEffect, useState } from "react";
import { adminOrderService } from "@/lib/api/adminOrders";
import AdminOrderModal from "./AdminOrderModal";
import { canTransitionOrderStatus } from "@/lib/api/utils/orderStatus";
import AdminOrdersList from "./AdminOrderList";

import type { OrderStatus } from "@/lib/types/orderStatuses";
import type { PagedResult } from "@/lib/types/PagedResult";
import type { AdminOrder } from "@/lib/types/adminOrder";

const PAGE_SIZE = 8;

export default function AdminOrdersManager() {
    const [orders, setOrders] = useState<PagedResult<AdminOrder>>({
        items: [],
        page: 1,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });

    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(false);

    const loadPage = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const res = await adminOrderService.getOrders({
                page,
                pageSize: PAGE_SIZE,
            });
            setOrders(res);
        } finally {
            setLoading(false);
        }
    }, []);

    const onView = useCallback(async (orderId: number) => {
        setLoading(true);
        try {
            const order = await adminOrderService.getById(orderId);
            setSelectedOrder(order);
        } finally {
            setLoading(false);
        }
    }, []);

    const onChangeStatus = useCallback(
        async (orderId: number, nextStatus: OrderStatus) => {
            const currentOrder =
                selectedOrder?.orderId === orderId
                    ? selectedOrder
                    : orders.items.find((o) => o.orderId === orderId);

            if (!currentOrder) return;

            if (!canTransitionOrderStatus(currentOrder.status, nextStatus)) {
                return;
            }

            setLoading(true);
            try {
                await adminOrderService.updateStatus(orderId, nextStatus);

                const updated = await adminOrderService.getById(orderId);
                setSelectedOrder(updated);

                const refreshed = await adminOrderService.getOrders({
                    page: orders.page,
                    pageSize: PAGE_SIZE,
                });
                setOrders(refreshed);
            } finally {
                setLoading(false);
            }
        },
        [orders.items, orders.page, selectedOrder]
    );

    useEffect(() => {
        loadPage(1);
    }, []);

    return (
        <div className="space-y-4">
            <AdminOrdersList
                orders={orders.items}
                page={orders.page}
                totalPages={orders.totalPages}
                onPageChange={loadPage}
                onView={onView}
            />

            {loading && <p className="text-sm text-gray-500">Cargando...</p>}

            <AdminOrderModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onChangeStatus={onChangeStatus}
            />
        </div>
    );
}