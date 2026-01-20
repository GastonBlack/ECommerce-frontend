import api from "./axios";
import { Category } from "../types/category";

export const CategoryService = {
    async getAll(): Promise<Category[]> {
        const res = await api.get("/category");
        return res.data;
    }
};