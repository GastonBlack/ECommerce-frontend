import api from "./axios";
import type { Product } from "@/lib/types/product";
import type { AdminProduct } from "../types/adminProduct";

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
    async getAll(sort?: string): Promise<Product[]> { // Parametro para que pueda aceptar el filtro popular.
        const res = await api.get("/product", {
            params: sort ? { sort } : undefined,
        });
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
    async getAllAdmin(): Promise<AdminProduct[]> {
        const res = await api.get("/product/admin");
        return res.data;
    },

    async getByIdAdmin(id: number): Promise<AdminProduct[]> {
        const res = await api.get(`/product/admin/${id}`);
        return res.data;
    }
};