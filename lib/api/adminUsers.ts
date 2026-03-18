import api from "./axios";
import type { AdminUser } from "@/lib/types/adminUser";
import type { PagedResult } from "../types/PagedResult";

export const adminUsersService = {
    async getPaged(params: {
        page: number;
        pageSize: number;
        search?: string;
        includeDisabled?: boolean;
    }): Promise<PagedResult<AdminUser>> {
        const res = await api.get("/admin/users", { params });

        const data = res.data; // Por caso de PascalCase desde .NET.
        
        return {
            items: data.items ?? data.Items ?? [],                          //
            page: data.page ?? data.Page ?? params.page,                    //
            pageSize: data.pageSize ?? data.PageSize ?? params.pageSize,    //  Por las dudas si sucede algún error de PascalCase.
            totalItems: data.totalItems ?? data.TotalItems ?? 0,            //
            totalPages: data.totalPages ?? data.TotalPages ?? 1,            //
        };
    },

    async disable(id: number): Promise<{ message: string }> {
        const res = await api.patch(`/admin/users/${id}/disable`);
        return res.data;
    },

    async enable(id: number): Promise<{ message: string }> {
        const res = await api.patch(`/admin/users/${id}/enable`);
        return res.data;
    },
};