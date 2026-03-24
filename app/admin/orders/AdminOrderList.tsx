"use client";

import type { AdminOrder } from "@/lib/types/adminOrder";
import { formatDate } from "@/lib/utils/generalUtils";
import Pagination from "@/app/components/Pagination";
import { getOrderStatusUI } from "@/lib/utils/orderStatus";

interface AdminOrdersListProps {
    orders: AdminOrder[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onView: (orderId: number) => void;
}

export default function AdminOrdersList({
    orders,
    page,
    totalPages,
    onPageChange,
    onView,
}: AdminOrdersListProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Pedidos</h2>
                <p className="text-sm text-gray-500">
                    Página {page} de {Math.max(totalPages, 1)}
                </p>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 text-xs font-semibold text-gray-600 text-center">
                    <div>Pedido</div>
                    <div>Usuario</div>
                    <div>Fecha</div>
                    <div>Productos</div>
                    <div>Estado</div>
                    <div>Total</div>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
                {orders.map((o) => {
                    const ui = getOrderStatusUI(o.status);

                    return (
                        <div
                            key={o.orderId}
                            onClick={() => onView(o.orderId)}
                            className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition"
                        >
                            <div className="grid grid-cols-6 gap-4 p-4 text-center items-center">
                                <div className="flex flex-col">
                                    <span className="font-semibold">#{o.orderId}</span>
                                    <span className="text-xs text-gray-500">Pedido</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-medium">{o.userName}</span>
                                    <span className="text-xs text-gray-500">{o.userEmail}</span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {formatDate(o.createdAt)}
                                </div>

                                <div className="text-sm">
                                    {o.totalItems} {o.totalItems === 1 ? "producto" : "productos"}
                                </div>

                                <div>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-xl border text-xs font-medium ${ui.badge}`}
                                    >
                                        {ui.label}
                                    </span>
                                </div>

                                <div className="font-semibold">
                                    ${o.totalAmount}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="border-t border-gray-200 px-5 py-4">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}