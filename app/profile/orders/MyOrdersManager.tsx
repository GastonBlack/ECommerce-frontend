"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { orderService } from "@/lib/api/orders";
import OrdersList from "./OrdersList";
import OrderModal from "./OrderModal";
import type { Order } from "@/lib/types/order";
import type { PagedResult } from "@/lib/types/PagedResult";

const PAGE_SIZE = 4;

export default function OrdersManager() {
    const router = useRouter();

    const [orders, setOrders] = useState<PagedResult<Order>>({
        items: [],
        page: 1,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
    });

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    const loadPage = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const res = await orderService.getOrders({
                page: p,
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
            const full = await orderService.getById(orderId);
            setSelectedOrder(full);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPage(1);
    }, []);

    return (
        <div className="flex items-start justify-center pt-12">
            <button
                className="flex items-center mr-4 cursor-pointer hover:scale-[1.02] transition-all duration-150"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-6 h-6" />
                <p className="text-sm text-gray-400">Volver</p>
            </button>

            <OrdersList
                orders={orders.items}
                page={orders.page}
                totalPages={orders.totalPages}
                onPageChange={loadPage}
                onView={onView}
            />

            <OrderModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            {loading && <p className="text-xs text-gray-400 mt-2">Cargando...</p>}
        </div>
    );
}