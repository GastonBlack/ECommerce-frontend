"use client";

import { useCallback, useState } from "react";
import UsersSection from "./UsersSection";
import { adminUsersService } from "@/lib/api/adminUsers";
import { useNotification } from "@/app/components/NotificationProvider";

import type { AdminUser } from "@/lib/types/adminUser";
import type { PagedResult } from "@/lib/types/PagedResult";

const PAGE_SIZE = 25;

export default function UsersManager({
    initialUsers,
}: {
    initialUsers: PagedResult<AdminUser>;
}) {
    const { showNotification } = useNotification();

    const [usersData, setUsersData] = useState<PagedResult<AdminUser>>(initialUsers);

    const [search, setSearch] = useState("");
    const [includeDisabled, setIncludeDisabled] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(
        async (next: {
            page?: number;
            search?: string;
            includeDisabled?: boolean;
        } = {}) => {
            const nextPage = next.page ?? usersData.page;
            const nextSearch = next.search ?? search;
            const nextIncludeDisabled = next.includeDisabled ?? includeDisabled;

            setLoading(true);
            setError("");

            try {
                const res = await adminUsersService.getPaged({
                    page: nextPage,
                    pageSize: PAGE_SIZE,
                    search: nextSearch.trim() || undefined,
                    includeDisabled: nextIncludeDisabled,
                });

                setUsersData(res);
            } catch (e: any) {
                setError(e?.response?.data?.error || "Error cargando usuarios.");
            } finally {
                setLoading(false);
            }
        },
        [usersData.page, search, includeDisabled]
    );

    const onReload = useCallback(async () => {
        await load({ page: usersData.page });
    }, [load, usersData.page]);

    const onSearchChange = useCallback(
        (v: string) => {
            setSearch(v);
            load({ page: 1, search: v });
        },
        [load]
    );

    const onIncludeDisabledChange = useCallback(
        (v: boolean) => {
            setIncludeDisabled(v);
            load({ page: 1, includeDisabled: v });
        },
        [load]
    );

    const onPageChange = useCallback(
        (p: number) => {
            load({ page: p });
        },
        [load]
    );

    const disableUser = useCallback(
        async (u: AdminUser) => {
            try {
                await adminUsersService.disable(u.id);
                showNotification("Usuario deshabilitado correctamente.", "success");

                const refreshed = await adminUsersService.getPaged({
                    page: usersData.page,
                    pageSize: PAGE_SIZE,
                    search: search.trim() || undefined,
                    includeDisabled,
                });

                setUsersData(refreshed);
            } catch (e: any) {
                showNotification(
                    e?.response?.data?.error || "No se pudo deshabilitar el usuario.",
                    "error"
                );
            }
        },
        [showNotification, usersData.page, search, includeDisabled]
    );

    const enableUser = useCallback(
        async (u: AdminUser) => {
            try {
                await adminUsersService.enable(u.id);
                showNotification("Usuario habilitado correctamente.", "success");

                const refreshed = await adminUsersService.getPaged({
                    page: usersData.page,
                    pageSize: PAGE_SIZE,
                    search: search.trim() || undefined,
                    includeDisabled,
                });

                setUsersData(refreshed);
            } catch (e: any) {
                showNotification(
                    e?.response?.data?.error || "No se pudo habilitar el usuario.",
                    "error"
                );
            }
        },
        [showNotification, usersData.page, search, includeDisabled]
    );

    return (
        <UsersSection
            users={usersData.items}
            loading={loading}
            error={error}
            page={usersData.page}
            totalPages={usersData.totalPages}
            search={search}
            includeDisabled={includeDisabled}
            onSearchChange={onSearchChange}
            onIncludeDisabledChange={onIncludeDisabledChange}
            onPageChange={onPageChange}
            onReload={onReload}
            onDisable={disableUser}
            onEnable={enableUser}
        />
    );
}