"use client";

import type { Order } from "@/lib/types/order";
import { formatDate } from "@/lib/api/utils/generalUtils";
import Pagination from "@/app/components/Pagination";
import { getOrderStatusUI } from "@/lib/api/utils/orderStatus";
import { PackageSearch } from "lucide-react";

interface OrdersListProps {
    orders: Order[];
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onView: (orderId: number) => void;
}

function getStatusBarClass(status?: string) {
    const s = (status ?? "").toLowerCase();

    if (s === "paid") return "bg-green-500";
    if (s === "preparing") return "bg-blue-500";
    if (s === "shipped") return "bg-violet-500";
    if (s === "delivered") return "bg-emerald-500";
    if (s === "cancelled") return "bg-red-500";

    return "bg-orange-400";
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
            <div className="w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Mis pedidos</h2>
                    <p className="text-xs text-gray-500">Todavía no tenés compras registradas.</p>
                </div>

                <div className="px-6 py-14 sm:py-16 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-50">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <PackageSearch className="w-8 h-8 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                        No tenés pedidos todavía
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        Cuando realices una compra, acá vas a poder ver el historial, el estado de cada pedido y sus detalles.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Mis pedidos</h2>
                <p className="text-xs text-gray-500">
                    Página {page} de {Math.max(totalPages, 1)}
                </p>
            </div>

            <div className="hidden lg:block px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-6 items-center justify-items-center gap-4 text-xs font-semibold text-gray-600 text-center">
                    <div>Nro pedido</div>
                    <div>Fecha de creación</div>
                    <div>Productos</div>
                    <div>Estado</div>
                    <div>Total</div>
                    <div>Acciones</div>
                </div>
            </div>

            <div className="p-3 sm:p-4 flex flex-col gap-3">
                {orders.map((o) => {
                    const ui = getOrderStatusUI(o.status);
                    const barClass = getStatusBarClass(o.status);

                    return (
                        <div
                            key={o.orderId}
                            className="rounded-md border border-gray-200 bg-white transition overflow-hidden cursor-pointer hover:shadow-xl hover:scale-101"
                            onClick={() => onView(o.orderId)}
                        >
                            <div className="flex">
                                <div className={`w-1.5 sm:w-2 ${barClass}`} />

                                <div className="flex-1 p-4">
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    N° #{o.orderId}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Tu compra
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-xl border text-xs font-medium whitespace-nowrap ${ui.badge}`}
                                            >
                                                {ui.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                                                <p className="text-[11px] text-gray-500 mb-1">Fecha</p>
                                                <div className="text-gray-700">
                                                    <div>{formatDate(o.createdAt).split(",")[0]}</div>
                                                    <div>{formatDate(o.createdAt).split(",")[1]}</div>
                                                </div>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                                                <p className="text-[11px] text-gray-500 mb-1">Productos</p>
                                                <div className="text-gray-700">
                                                    <span className="font-semibold text-gray-900">
                                                        {o.items.length}
                                                    </span>{" "}
                                                    {o.items.length === 1 ? "Producto" : "Productos"}
                                                </div>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 col-span-2 sm:col-span-1">
                                                <p className="text-[11px] text-gray-500 mb-1">Total</p>
                                                <div className="font-semibold text-gray-900">
                                                    ${o.totalAmount}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(o.orderId);
                                                }}
                                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold cursor-pointer"
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden lg:grid grid-cols-6 items-center justify-items-center gap-4 text-center">
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
                <div className="border-t border-gray-200 px-4 sm:px-5 py-4">
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