"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProductsTable, { AdminProductsFilters } from "./ProductsTable";
import ProductForm from "./ProductForm";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useNotification } from "@/app/components/NotificationProvider";
import { scrollToId } from "@/lib/utils/generalUtils";
import { productService } from "@/lib/api/products";
import { categoryService } from "@/lib/api/category";

import type { Category } from "@/lib/types/category";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { PagedResult } from "@/lib/types/PagedResult";

export default function ProductsManager() {
    const { showNotification } = useNotification();

    const [categories, setCategories] = useState<Category[]>([]);

    const [productsPage, setProductsPage] = useState<PagedResult<AdminProduct>>({
        items: [],
        page: 1,
        pageSize: 25,
        totalItems: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState<AdminProductsFilters>({
        nameQuery: "",
        categoryId: 0,
        stockSort: "none",
    });

    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res);
        } catch (e: any) {
            showNotification(
                e?.response?.data?.error || "Error cargando categorías.",
                "error"
            );
        }
    }, [showNotification]);

    const fetchProducts = useCallback(
        async (nextPage: number, filters: AdminProductsFilters) => {
            setLoading(true);

            try {
                const res = await productService.getAllAdmin({
                    page: nextPage,
                    pageSize: 25,
                    sort:
                        filters.stockSort === "asc"
                            ? "stock-asc"
                            : filters.stockSort === "desc"
                                ? "stock-desc"
                                : "name-asc",
                    categoryId:
                        filters.categoryId && filters.categoryId !== 0
                            ? filters.categoryId
                            : null,
                    search: filters.nameQuery?.trim() || "",
                });

                setProductsPage(res);
            } catch (e: any) {
                showNotification(
                    e?.response?.data?.error || "Error cargando productos.",
                    "error"
                );
            } finally {
                setLoading(false);
            }
        },
        [showNotification]
    );

    const applyFilters = useCallback(
        async (filters: AdminProductsFilters) => {
            setAppliedFilters(filters);
            await fetchProducts(1, filters);
        },
        [fetchProducts]
    );

    const changePage = useCallback(
        async (p: number) => {
            await fetchProducts(p, appliedFilters);
        },
        [fetchProducts, appliedFilters]
    );

    const refreshCurrent = useCallback(async () => {
        await fetchProducts(productsPage.page, appliedFilters);
    }, [fetchProducts, productsPage.page, appliedFilters]);

    const confirmDelete = useCallback(async () => {
        if (!productToDelete) return;

        try {
            await productService.remove(productToDelete.id);
            showNotification("Producto eliminado correctamente.", "success");
            setProductToDelete(null);

            const nextPage =
                productsPage.page > 1 && productsPage.items.length === 1
                    ? productsPage.page - 1
                    : productsPage.page;

            await fetchProducts(nextPage, appliedFilters);
        } catch (e: any) {
            showNotification(
                e?.response?.data?.error || "No se pudo eliminar el producto.",
                "error"
            );
        }
    }, [productToDelete, showNotification, fetchProducts, appliedFilters, productsPage]);

    const openCreateModal = () => {
        setEditingProduct(null);
        setProductModalOpen(true);
    };

    const openEditModal = (product: AdminProduct) => {
        setEditingProduct(product);
        setProductModalOpen(true);
    };

    const closeProductModal = () => {
        setProductModalOpen(false);
        setEditingProduct(null);
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts(1, appliedFilters);
    }, []);

    useEffect(() => {
        scrollToId("adminTop");
    }, [productsPage.page]);

    return (
        <div className="flex flex-col items-center justify-center gap-4" id="adminTop">

            <div className="flex items-center justify-center">
                <button
                    onClick={openCreateModal}
                    className="flex h-11 w-11 items-center justify-center rounded-sm bg-black text-white shadow-sm hover:opacity-90 cursor-pointer"
                    title="Agregar producto"
                    aria-label="Agregar producto"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <ProductsTable
                loading={loading}
                products={productsPage.items}
                categories={categories}
                page={productsPage.page}
                totalPages={Math.max(productsPage.totalPages, 1)}
                onPageChange={changePage}
                onEdit={openEditModal}
                onDeleteRequest={setProductToDelete}
                onFiltersApply={applyFilters}
                appliedFilters={appliedFilters}
            />

            <ProductForm
                open={productModalOpen}
                product={editingProduct}
                categories={categories}
                onSaved={async () => {
                    closeProductModal();
                    await refreshCurrent();
                    showNotification(
                        editingProduct
                            ? "Producto editado correctamente."
                            : "Producto creado correctamente.",
                        "success"
                    );
                }}
                onCancel={closeProductModal}
            />

            <ConfirmModal
                open={!!productToDelete}
                message={`¿Eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
                onCancel={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}