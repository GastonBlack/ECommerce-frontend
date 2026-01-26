import api from "./axios";
import { UserMe } from "@/lib/types/user";

export const userService = {

    async getMe(): Promise<UserMe> {
        const res = await api.get("/user/me");
        return res.data;
    },

    async updateMe(payload: { fullName: string; address?: string | null; phone?: string | null }): Promise<UserMe> {
        const res = await api.put("/user/me", payload);
        return res.data;
    },

    async changePassword(payload: { currentPassword: string; newPassword: string }) {
        const res = await api.put("/user/me/password", payload);
        return res.data;
    },

}