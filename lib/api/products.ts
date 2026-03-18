import api from "./axios";
import type { Product } from "@/lib/types/product";
import type { AdminProduct } from "../types/adminProduct";
import type { PagedResult } from "../types/PagedResult";

export type ProductCreateDto = {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
    categoryId: number;
};

export type ProductUpdateDto = ProductCreateDto;

export const productService = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        categoryId?: number | null;
        minPrice?: number | null;
        maxPrice?: number | null;
        search?: string;
    }): Promise<PagedResult<Product>> {
        const res = await api.get("/product", { params });
        return res.data;
    },

    async getById(id: number): Promise<Product> {
        const res = await api.get(`/product/${id}`);
        return res.data;
    },

    async create(dto: ProductCreateDto): Promise<Product> {
        const res = await api.post("/product", dto);
        return res.data;
    },

    async update(id: number, dto: ProductUpdateDto): Promise<Product> {
        const res = await api.put(`/product/${id}`, dto);
        return res.data;
    },

    async remove(id: number) {
        const res = await api.delete(`/product/${id}`);
        return res.data;
    },

    async uploadImage(file: File): Promise<string> {
        const fd = new FormData();
        fd.append("file", file);

        const res = await api.post("/product/upload-image", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data.imageUrl;
    },

    // ======== ADMIN ======= //
    async getAllAdmin(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        categoryId?: number | null;
        minPrice?: number | null;
        maxPrice?: number | null;
        search?: string;
    }): Promise<PagedResult<AdminProduct>> {
        const res = await api.get("/product/admin", { params });
        return res.data;
    },
};