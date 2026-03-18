"use client";

import { useCallback, useEffect, useState } from "react";
import ProductsTable, { AdminProductsFilters } from "./ProductsTable";
import ProductForm from "./ProductForm";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useNotification } from "@/app/components/NotificationProvider";
import { scrollToId } from "@/lib/api/utils/generalUtils";
import { productService } from "@/lib/api/products";

import type { Category } from "@/lib/types/category";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { PagedResult } from "@/lib/types/PagedResult";

export default function ProductsManager({
    initialCategories,
    initialProductsPage,
}: {
    initialCategories: Category[];
    initialProductsPage: PagedResult<AdminProduct>;
}) {
    const { showNotification } = useNotification();

    const [categories] = useState<Category[]>(initialCategories);

    const [productsPage, setProductsPage] = useState<PagedResult<AdminProduct>>(initialProductsPage);

    const [loading, setLoading] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState<AdminProductsFilters>({
        nameQuery: "",
        categoryId: 0,
        stockSort: "none",
    });

    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
    const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

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
            showNotification(e?.response?.data?.error || "No se pudo eliminar el producto.", "error");
        }
    }, [productToDelete, showNotification, fetchProducts, appliedFilters, productsPage]);

    useEffect(() => {
        scrollToId("adminTop");
    }, [productsPage.page]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="adminTop">
            <div className="xl:col-span-2">
                <ProductsTable
                    loading={loading}
                    products={productsPage.items}
                    categories={categories}
                    page={productsPage.page}
                    totalPages={Math.max(productsPage.totalPages, 1)}
                    onPageChange={changePage}
                    onEdit={setEditingProduct}
                    onDeleteRequest={setProductToDelete}
                    onFiltersApply={applyFilters}
                    appliedFilters={appliedFilters}
                />
            </div>

            <ProductForm
                product={editingProduct}
                categories={categories}
                onSaved={async () => {
                    setEditingProduct(null);
                    await refreshCurrent();
                    showNotification("Producto guardado correctamente.", "success");
                }}
                onCancel={() => setEditingProduct(null)}
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