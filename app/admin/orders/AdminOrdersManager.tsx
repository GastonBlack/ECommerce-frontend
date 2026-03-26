"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminOrderService } from "@/lib/api/adminOrders";
import AdminOrderModal from "./AdminOrderModal";
import { canTransitionOrderStatus } from "@/lib/utils/orderStatus";
import AdminOrdersList from "./AdminOrderList";

import type { OrderStatus } from "@/lib/types/orderStatuses";
import type { PagedResult } from "@/lib/types/PagedResult";
import type { AdminOrder } from "@/lib/types/adminOrder";
import type { AdminOrderFilters } from "@/lib/types/adminOrderFilters";

const PAGE_SIZE = 8;

export default function AdminOrdersManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialFilters = useMemo<AdminOrderFilters>(() => ({
        search: searchParams.get("search") ?? "",
        status: (searchParams.get("status") as OrderStatus | "") ?? "",
        dateFrom: searchParams.get("dateFrom") ?? "",
        dateTo: searchParams.get("dateTo") ?? "",
    }), [searchParams]);

    const initialPage = Number(searchParams.get("page") ?? "1") || 1;

    const [orders, setOrders] = useState<PagedResult<AdminOrder>>({
        items: [],
        page: initialPage,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });

    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(false);

    // Filtros aplicados (los que pegan a la API).
    const [appliedFilters, setAppliedFilters] = useState<AdminOrderFilters>(initialFilters);

    // Filtros del formulario.
    const [draftFilters, setDraftFilters] = useState<AdminOrderFilters>(initialFilters);

    const updateUrl = useCallback((page: number, filters: AdminOrderFilters) => {
        const params = new URLSearchParams();

        if (page > 1) params.set("page", String(page));
        if (filters.search.trim()) params.set("search", filters.search.trim());
        if (filters.status) params.set("status", filters.status);
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [pathname, router]);

    const loadPage = useCallback(async (page: number, filters?: AdminOrderFilters) => {
        const finalFilters = filters ?? appliedFilters;

        setLoading(true);
        try {
            const res = await adminOrderService.getOrders({
                page,
                pageSize: PAGE_SIZE,
                search: finalFilters.search.trim() || undefined,
                status: finalFilters.status || undefined,
                dateFrom: finalFilters.dateFrom || undefined,
                dateTo: finalFilters.dateTo || undefined,
            });

            setOrders(res);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters]);

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
                    search: appliedFilters.search.trim() || undefined,
                    status: appliedFilters.status || undefined,
                    dateFrom: appliedFilters.dateFrom || undefined,
                    dateTo: appliedFilters.dateTo || undefined,
                });

                setOrders(refreshed);
            } finally {
                setLoading(false);
            }
        },
        [orders.items, orders.page, selectedOrder, appliedFilters]
    );

    const applyFilters = useCallback(async () => {
        setAppliedFilters(draftFilters);
        updateUrl(1, draftFilters);
        await loadPage(1, draftFilters);
    }, [draftFilters, loadPage, updateUrl]);

    const clearFilters = useCallback(async () => {
        const cleared: AdminOrderFilters = {
            search: "",
            status: "",
            dateFrom: "",
            dateTo: "",
        };

        setDraftFilters(cleared);
        setAppliedFilters(cleared);
        updateUrl(1, cleared);
        await loadPage(1, cleared);
    }, [loadPage, updateUrl]);

    const changePage = useCallback(async (page: number) => {
        updateUrl(page, appliedFilters);
        await loadPage(page, appliedFilters);
    }, [appliedFilters, loadPage, updateUrl]);

    useEffect(() => {
        loadPage(initialPage, initialFilters);
    }, []);

    return (
        <div className="space-y-4">
            <AdminOrdersList
                orders={orders.items}
                page={orders.page}
                totalPages={orders.totalPages}
                onPageChange={changePage}
                onView={onView}
                filters={draftFilters}
                onFiltersChange={setDraftFilters}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
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