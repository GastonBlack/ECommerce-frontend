"use client";

import { useMemo, useState } from "react";
import type { AdminUser } from "@/lib/types/adminUser";
import UsersToolbar from "./UsersToolbar";
import UsersTable from "./UsersTable";

export default function UsersSection({
    users,
    loading,
    error,
    onReload,
    onDisable,
    onEnable,
}: {
    users: AdminUser[];
    loading: boolean;
    error: string;
    onReload: () => void;
    onDisable: (u: AdminUser) => Promise<void> | void;
    onEnable: (u: AdminUser) => Promise<void> | void;
}) {
    const [query, setQuery] = useState("");
    const [busyId, setBusyId] = useState<number | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;

        return users.filter(
            (u) =>
                u.fullName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        );
    }, [users, query]);

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
            </div>

            <UsersToolbar query={query} onQueryChange={setQuery} onReload={onReload} loading={loading} />

            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <UsersTable
                users={filtered}
                busyId={busyId}
                onDisable={(u) => wrap(u.id, () => onDisable(u))}
                onEnable={(u) => wrap(u.id, () => onEnable(u))}
            />
        </div>
    );
}
