import api from "./axios";
import { Category } from "../types/category";

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const res = await api.get("/category");
        return res.data;
    },
    async getById(id: number): Promise<Category> {
        const res = await api.get(`/category/${id}`);
        return res.data;
    },

    async create(dto: { name: string }): Promise<Category> {
        const res = await api.post("/category", dto);
        return res.data;
    },

    async update(id: number, dto: { name: string }): Promise<Category> {
        const res = await api.put(`/category/${id}`, dto);
        return res.data;
    },

    async remove(id: number): Promise<{ message: string }> {
        const res = await api.delete(`/category/${id}`);
        return res.data;
    },
};