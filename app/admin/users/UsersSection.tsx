"use client";

import { useState } from "react";
import type { AdminUser } from "@/lib/types/adminUser";
import UsersToolbar from "./UsersToolbar";
import UsersTable from "./UsersTable";
import Pagination from "@/app/components/Pagination";
import UserDetailsModal from "./UserDetailsModal";

interface Props {
    users: AdminUser[];
    loading: boolean;
    error: string;

    page: number;
    totalPages: number;

    search: string;
    includeDisabled: boolean;

    onSearchChange: (v: string) => void;
    onIncludeDisabledChange: (v: boolean) => void;
    onPageChange: (p: number) => void;

    onReload: () => void;
    onDisable: (u: AdminUser) => Promise<void> | void;
    onEnable: (u: AdminUser) => Promise<void> | void;
}

export default function UsersSection({
    users,
    loading,
    error,
    page,
    totalPages,
    search,
    includeDisabled,
    onSearchChange,
    onIncludeDisabledChange,
    onPageChange,
    onReload,
    onDisable,
    onEnable,
}: Props) {
    const [busyId, setBusyId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    const wrap = async (id: number, fn: () => Promise<void> | void) => {
        setBusyId(id);
        try {
            await fn();
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Usuarios</h2>
                <p className="text-xs text-gray-500">
                    Página {page} de {Math.max(totalPages, 1)}
                </p>
            </div>

            <UsersToolbar
                query={search}
                onQueryChange={onSearchChange}
                onReload={onReload}
                loading={loading}
                showDisabled={includeDisabled}
                onShowDisabledChange={onIncludeDisabledChange}
            />

            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <UsersTable
                users={users}
                busyId={busyId}
                onDisable={(u) => wrap(u.id, () => onDisable(u))}
                onEnable={(u) => wrap(u.id, () => onEnable(u))}
                onRowClick={(u) => setSelectedUser(u)}
            />

            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={onPageChange}
                    />
                </div>
            )}

            <UserDetailsModal
                open={!!selectedUser}
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onViewOrders={(u) => {
                    console.log("TODO: ver pedidos userId =", u.id);
                }}
            />
        </div>
    );
}