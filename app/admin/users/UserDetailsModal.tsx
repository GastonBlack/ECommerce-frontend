"use client";

import type { AdminUser } from "@/lib/types/adminUser";

function Badge({
    children,
    tone,
}: {
    children: React.ReactNode;
    tone: "dark" | "gray" | "green" | "red";
}) {
    const cls =
        tone === "dark"
            ? "bg-black text-white"
            : tone === "green"
                ? "bg-green-100 text-green-700 border border-green-200"
                : tone === "red"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200";

    return <span className={`text-xs px-2 py-1 rounded-xl ${cls}`}>{children}</span>;
}

interface UserDetailsModalProps {
    open: boolean;
    user: AdminUser | null;
    onClose: () => void;
    onViewOrders: (u: AdminUser) => void;
}

export default function UserDetailsModal({
    open,
    user,
    onClose,
    onViewOrders,
}: UserDetailsModalProps) {
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">Detalles del usuario</h3>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Nombre</div>
                        <div className="font-medium">{user.fullName}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="font-medium">{user.email}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">Rol</div>
                        {user.rol === "Admin" ? (
                            <Badge tone="dark">Admin</Badge>
                        ) : (
                            <Badge tone="gray">User</Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">Estado</div>
                        {user.isDisabled ? (
                            <Badge tone="red">Deshabilitado</Badge>
                        ) : (
                            <Badge tone="green">Activo</Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-gray-200 p-3">
                            <div className="text-xs text-gray-500">Creado</div>
                            <div className="text-sm font-medium">
                                {new Date(user.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-3">
                            <div className="text-xs text-gray-500">Deshabilitado</div>
                            <div className="text-sm font-medium">
                                {user.disabledAt ? new Date(user.disabledAt).toLocaleString() : "—"}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                        <div className="text-sm font-semibold mb-2">Pedidos</div>
                        <p className="text-xs text-gray-500 mb-3">
                            Después conectamos esto al endpoint de orders para mostrar pedidos del usuario.
                        </p>

                        <button
                            onClick={() => onViewOrders(user)}
                            className="w-full px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 cursor-pointer text-sm"
                        >
                            Ver pedidos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}