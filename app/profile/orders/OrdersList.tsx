"use client";

import type { Order } from "@/lib/types/order";
import { formatDate } from "@/lib/api/utils/generalUtils";
import Pagination from "@/app/components/Pagination";
import { getOrderStatusUI } from "@/lib/api/utils/orderStatus";

interface OrdersListProps {
    orders: Order[];
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onView: (orderId: number) => void;
}

export default function OrdersList({
    orders,
    page,
    totalPages,
    onPageChange,
    onView,
}: OrdersListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-gray-500">No tenés pedidos todavía.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-[60%]">
            <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Mis pedidos</h2>
                <p className="text-xs text-gray-500">
                    Página {page} de {Math.max(totalPages, 1)}
                </p>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-6 items-center justify-items-center gap-4 text-xs font-semibold text-gray-600 text-center">
                    <div>Nro pedido</div>
                    <div>Fecha de creación</div>
                    <div>Productos</div>
                    <div>Estado</div>
                    <div>Total</div>
                    <div>Acciones</div>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
                {orders.map((o) => {
                    const ui = getOrderStatusUI(o.status);

                    return (
                        <div
                            key={o.orderId}
                            className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition overflow-hidden cursor-pointer"
                            onClick={() => onView(o.orderId)}
                        >
                            <div className="flex">
                                <div className={`w-2 ${ui.badge}`} />

                                <div className="flex-1 p-4">
                                    <div className="grid grid-cols-6 items-center justify-items-center gap-4 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="font-semibold">N° #{o.orderId}</div>
                                            <div className="text-xs text-gray-500">Tu compra</div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                                            <span>{formatDate(o.createdAt).split(",")[0]}</span>
                                            <span>{formatDate(o.createdAt).split(",")[1]}</span>
                                        </div>

                                        <div className="flex flex-col items-center justify-center text-sm text-gray-700">
                                            <span className="font-semibold text-gray-900">
                                                {o.items.length}
                                            </span>
                                            <span>
                                                {o.items.length === 1 ? "Producto" : "Productos"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center justify-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-xl border text-xs font-medium ${ui.badge}`}
                                            >
                                                {ui.label}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center justify-center text-sm text-gray-700">
                                            <span className="font-semibold text-gray-900">
                                                ${o.totalAmount}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(o.orderId);
                                                }}
                                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold cursor-pointer"
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
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