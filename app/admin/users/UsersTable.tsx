"use client";

import { useState } from "react";
import type { AdminUser } from "@/lib/types/adminUser";
import ConfirmModal from "@/app/components/ConfirmModal";

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

    return (
        <span className={`rounded-xl px-2 py-1 text-xs ${cls}`}>
            {children}
        </span>
    );
}

interface UsersTableProps {
    users: AdminUser[];
    busyId: number | null;
    onDisable: (u: AdminUser) => void;
    onEnable: (u: AdminUser) => void;
    onRowClick: (u: AdminUser) => void;
}

type PendingAction = "disable" | "enable";

export default function UsersTable({
    users,
    busyId,
    onDisable,
    onEnable,
    onRowClick,
}: UsersTableProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction>("disable");

    const openConfirm = (user: AdminUser, action: PendingAction) => {
        setSelectedUser(user);
        setPendingAction(action);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const confirmAction = () => {
        if (!selectedUser) return;

        if (pendingAction === "disable") onDisable(selectedUser);
        else onEnable(selectedUser);

        closeConfirm();
    };

    const confirmMessage =
        pendingAction === "disable"
            ? `¿Estás seguro de que deseas deshabilitar a "${selectedUser?.fullName}"?`
            : `¿Estás seguro de que deseas habilitar a "${selectedUser?.fullName}"?`;

    if (!users || users.length === 0) {
        return (
            <p className="mt-2 text-sm text-gray-500 md:px-5 md:py-4">
                No hay usuarios para mostrar.
            </p>
        );
    }

    return (
        <>
            <div className="md:hidden space-y-3">
                {users.map((u) => {
                    const busy = busyId === u.id;

                    return (
                        <div
                            key={u.id}
                            className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                        >
                            <button
                                onClick={() => onRowClick(u)}
                                className="w-full text-left cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm break-words">
                                            {u.fullName}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 break-all">
                                            {u.email}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            ID: {u.id}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {u.rol === "Admin" ? (
                                            <Badge tone="dark">Admin</Badge>
                                        ) : (
                                            <Badge tone="gray">User</Badge>
                                        )}

                                        {u.isDisabled ? (
                                            <Badge tone="red">Deshabilitado</Badge>
                                        ) : (
                                            <Badge tone="green">Activo</Badge>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <div className="mt-4 flex items-center justify-end gap-2">
                                {u.rol === "Admin" ? (
                                    <span className="text-xs text-gray-400">No editable</span>
                                ) : u.isDisabled ? (
                                    <button
                                        onClick={() => openConfirm(u, "enable")}
                                        disabled={busy}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                                    >
                                        {busy ? "..." : "Habilitar"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openConfirm(u, "disable")}
                                        disabled={busy}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                                    >
                                        {busy ? "..." : "Deshabilitar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden md:block overflow-hidden rounded-b-xl">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                                <th className="px-4 py-3 text-left font-semibold">Email</th>
                                <th className="px-4 py-3 text-left font-semibold">Rol</th>
                                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => {
                                const busy = busyId === u.id;

                                return (
                                    <tr
                                        key={u.id}
                                        className="cursor-pointer border-t border-gray-100 transition-all hover:bg-gray-50"
                                        onClick={() => onRowClick(u)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{u.fullName}</div>
                                            <div className="text-xs text-gray-500">ID: {u.id}</div>
                                        </td>

                                        <td className="px-4 py-3">{u.email}</td>

                                        <td className="px-4 py-3">
                                            {u.rol === "Admin" ? (
                                                <Badge tone="dark">Admin</Badge>
                                            ) : (
                                                <Badge tone="gray">User</Badge>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {u.isDisabled ? (
                                                <Badge tone="red">Deshabilitado</Badge>
                                            ) : (
                                                <Badge tone="green">Activo</Badge>
                                            )}
                                        </td>

                                        <td
                                            className="px-4 py-3 text-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {u.rol === "Admin" ? (
                                                <span className="text-xs text-gray-400">No editable</span>
                                            ) : u.isDisabled ? (
                                                <button
                                                    onClick={() => openConfirm(u, "enable")}
                                                    disabled={busy}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                                                >
                                                    {busy ? "..." : "Habilitar"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => openConfirm(u, "disable")}
                                                    disabled={busy}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                                                >
                                                    {busy ? "..." : "Deshabilitar"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                message={confirmMessage}
                onConfirm={confirmAction}
                onCancel={closeConfirm}
            />
        </>
    );
}