"use client";

import type { AdminOrder } from "@/lib/types/adminOrder";
import type { AdminOrderFilters } from "@/lib/types/adminOrderFilters";
import { formatDate } from "@/lib/utils/generalUtils";
import Pagination from "@/app/components/Pagination";
import { getOrderStatusUI } from "@/lib/utils/orderStatus";
import { ORDER_STATUSES } from "@/lib/types/orderStatuses";

interface AdminOrdersListProps {
    orders: AdminOrder[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onView: (orderId: number) => void;

    filters: AdminOrderFilters;
    onFiltersChange: (next: AdminOrderFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export default function AdminOrdersList({
    orders,
    page,
    totalPages,
    onPageChange,
    onView,
    filters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters,
}: AdminOrdersListProps) {
    const set = (patch: Partial<AdminOrderFilters>) =>
        onFiltersChange({ ...filters, ...patch });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Pedidos</h2>
                <p className="text-sm text-gray-500">
                    Página {page} de {Math.max(totalPages, 1)}
                </p>
            </div>

            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por pedido, nombre o email..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 xl:col-span-2"
                        value={filters.search}
                        onChange={(e) => set({ search: e.target.value })}
                    />

                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                        value={filters.status}
                        onChange={(e) => set({ status: e.target.value as AdminOrderFilters["status"] })}
                    >
                        <option value="">Todos los estados</option>
                        <option value={ORDER_STATUSES.AWAITING_PAYMENT}>Esperando pago</option>
                        <option value={ORDER_STATUSES.PAID}>Pagado</option>
                        <option value={ORDER_STATUSES.PREPARING}>En preparación</option>
                        <option value={ORDER_STATUSES.SHIPPED}>Enviado</option>
                        <option value={ORDER_STATUSES.DELIVERED}>Entregado</option>
                        <option value={ORDER_STATUSES.CANCELLED}>Cancelado</option>
                        <option value={ORDER_STATUSES.EXPIRED}>Expirado</option>
                    </select>

                    <input
                        type="date"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={filters.dateFrom}
                        onChange={(e) => set({ dateFrom: e.target.value })}
                    />

                    <input
                        type="date"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={filters.dateTo}
                        onChange={(e) => set({ dateTo: e.target.value })}
                    />
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onApplyFilters}
                        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 cursor-pointer"
                    >
                        Aplicar filtros
                    </button>

                    <button
                        onClick={onClearFilters}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 hidden md:block">
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
                {orders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
                        <p className="text-sm font-medium text-gray-700">
                            No se encontraron pedidos con esos filtros.
                        </p>
                    </div>
                ) : (
                    orders.map((o) => {
                        const ui = getOrderStatusUI(o.status);

                        return (
                            <div
                                key={o.orderId}
                                onClick={() => onView(o.orderId)}
                                className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 text-center items-center">
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
                    })
                )}
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