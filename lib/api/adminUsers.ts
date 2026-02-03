import api from "./axios";
import type { AdminUser } from "@/lib/types/adminUser";

export const adminUsersService = {
    async getAll(): Promise<AdminUser[]> {
        const res = await api.get("/admin/users");
        return res.data;
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
