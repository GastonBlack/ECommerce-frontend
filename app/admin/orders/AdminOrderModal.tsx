"use client";

import { X } from "lucide-react";
import { formatDate } from "@/lib/utils/generalUtils";
import { getNextOrderStatuses, getOrderStatusActionLabel, getOrderStatusUI, isFinalOrderStatus } from "@/lib/utils/orderStatus";

import type { OrderStatus } from "@/lib/types/orderStatuses";
import type { AdminOrder } from "@/lib/types/adminOrder";

interface AdminOrderModalProps {
    order: AdminOrder | null;
    onClose: () => void;
    onChangeStatus: (orderId: number, status: OrderStatus) => void;
}

export default function AdminOrderModal({
    order,
    onClose,
    onChangeStatus,
}: AdminOrderModalProps) {
    if (!order) return null;

    const ui = getOrderStatusUI(order.status);
    const nextStatuses = getNextOrderStatuses(order.status);
    const isFinal = isFinalOrderStatus(order.status);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            >
                <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold">Detalle del pedido</h2>
                        <p className="text-sm text-gray-500">Pedido #{order.orderId}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Usuario</p>
                            <p className="font-medium">{order.userName}</p>
                            <p className="text-xs text-gray-500">{order.userEmail}</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Fecha</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Estado actual</p>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-xl border text-xs font-medium ${ui.badge}`}
                            >
                                {ui.label}
                            </span>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="font-semibold text-lg">${order.totalAmount}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                        <p className="text-sm font-semibold mb-3">Acciones de estado</p>

                        {isFinal ? (
                            <p className="text-sm text-gray-500">
                                Esta orden ya no puede cambiar de estado.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {nextStatuses.map((status) => {
                                    const nextUi = getOrderStatusUI(status);

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => onChangeStatus(order.orderId, status)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer hover:opacity-90 ${nextUi.badge}`}
                                        >
                                            {getOrderStatusActionLabel(status)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-base font-semibold mb-3">Productos</h3>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 text-center">
                                <div>Producto</div>
                                <div>Precio</div>
                                <div>Cantidad</div>
                                <div>Subtotal</div>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="grid grid-cols-4 px-4 py-4 text-sm text-center items-center"
                                    >
                                        <div className="font-medium text-gray-800">
                                            {item.productName}
                                        </div>
                                        <div>${item.priceAtPurchase}</div>
                                        <div>{item.quantity}</div>
                                        <div className="font-semibold">
                                            ${item.priceAtPurchase * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}