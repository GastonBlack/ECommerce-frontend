"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

import AdminLayout from "@/app/components/admin/AdminLayout";
import ProductsTable from "../components/admin/products/ProductsTable";
import ProductForm from "../components/admin/products/ProductForm";
import CategoriesTable from "../components/admin/categories/CategoriesTable";
import CategoryForm from "../components/admin/categories/CategoryForm";
import UsersSection from "../components/admin/users/UsersSection";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../components/NotificationProvider";

import { productService } from "@/lib/api/products";
import { categoryService } from "@/lib/api/category";
import { adminUsersService } from "@/lib/api/adminUsers";

import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import type { AdminUser } from "@/lib/types/adminUser";

export type AdminTab = "products" | "categories" | "orders" | "users";

export default function AdminPage() {
    const router = useRouter();
    const { user, loadingAuth } = useAuth();
    const { showNotification } = useNotification();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [confirmProductOpen, setConfirmProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [confirmCategoryOpen, setConfirmCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [tab, setTab] = useState<AdminTab>("products");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const reloadAll = async () => {
        setError("");
        setLoading(true);
        try {
            const [p, c, u] = await Promise.all([
                productService.getAll(),
                categoryService.getAll(),
                adminUsersService.getAll(),
            ]);
            setProducts(p);
            setCategories(c);
            setUsers(u);
        } catch (e: any) {
            setError(e?.response?.data?.error || "Error cargando datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loadingAuth) return;
        if (!user || user.rol !== "Admin")
            router.replace("/");

        reloadAll();
    }, [loadingAuth, user, router]);

    // Verificando Auth
    if (loadingAuth) {
        return <div className="p-6 text-gray-600">Verificando sesión...</div>;
    }
    if (!user || user.rol !== "Admin") return null;


    //////////////
    // HANDLERS //
    //////////////
    const openDisableConfirm = (u: AdminUser) => {
        setSelectedUser(u);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const confirmDisable = async () => {
        if (!selectedUser) return;

        try {
            await adminUsersService.disable(selectedUser.id);

            setUsers((prev) =>
                prev.map((x) =>
                    x.id === selectedUser.id ? { ...x, isDisabled: true } : x
                )
            );

            showNotification("Usuario deshabilitado correctamente.", "success");
        } catch (e: any) {
            showNotification(
                e?.response?.data?.error || "No se pudo deshabilitar el usuario.",
                "error"
            );
        } finally {
            closeConfirm();
        }
    };

    const openDeleteProductConfirm = (p: Product) => {
        setSelectedProduct(p);
        setConfirmProductOpen(true);
    };

    const closeDeleteProductConfirm = () => {
        setConfirmProductOpen(false);
        setSelectedProduct(null);
    };

    const confirmDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            await productService.remove(selectedProduct.id);
            await reloadAll();
            if (editingProduct?.id == selectedProduct.id)
                setEditingProduct(null);

            showNotification("Producto eliminado correctamente.", "success");
        } catch (e: any) {
            showNotification(
                e?.response?.data?.error || "No se pudo eliminar el producto.",
                "error"
            );
        } finally {
            closeDeleteProductConfirm();
        }
    };

    const openDeleteCategoryConfirm = (c: Category) => {
        setSelectedCategory(c);
        setConfirmCategoryOpen(true);
    };

    const closeDeleteCategoryConfirm = () => {
        setConfirmCategoryOpen(false);
        setSelectedCategory(null);
    };

    const confirmDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await categoryService.remove(selectedCategory.id);
            await reloadAll();

            showNotification("Categoría eliminada correctamente.", "success");
        } catch (e: any) {
            showNotification(
                e?.response?.data?.error ||
                "No se pudo eliminar la categoría. Puede tener productos asociados.",
                "error"
            );
        } finally {
            closeDeleteCategoryConfirm();
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////

    return (
        <AdminLayout
            tab={tab}
            setTab={(t) => {
                setTab(t);
                setEditingProduct(null);
                setEditingCategory(null);
            }}
            loading={loading}
            error={error}
            onGoStore={() => router.push("/")}
        >
            {tab === "products" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="adminTop">
                    <div className="xl:col-span-2">
                        <ProductsTable
                            products={products}
                            categories={categories}
                            onEdit={(p) => setEditingProduct(p)}
                            onDeleteRequest={openDeleteProductConfirm}
                        />
                    </div>

                    <ProductForm
                        product={editingProduct}
                        categories={categories}
                        onSaved={() => {
                            setEditingProduct(null);
                            reloadAll();
                        }}
                        onCancel={() => setEditingProduct(null)}
                    />
                </div>
            )}

            {tab === "categories" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <CategoriesTable
                            categories={categories}
                            onEdit={(c) => setEditingCategory(c)}
                            onDeleteRequest={openDeleteCategoryConfirm}
                        />
                    </div>

                    <CategoryForm
                        category={editingCategory}
                        onSaved={() => {
                            setEditingCategory(null);
                            reloadAll();
                        }}
                        onCancel={() => setEditingCategory(null)}
                    />
                </div>
            )}

            {tab === "orders" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-1">Pedidos</h2>
                    <p className="text-sm text-gray-600">TODO: FALTA IMPLEMENTAR.</p>
                </div>
            )}

            {tab === "users" && (
                <UsersSection
                    users={users}
                    loading={loading}
                    error={error}
                    onReload={reloadAll}
                    onDisable={(u) => openDisableConfirm(u)}
                    onEnable={async (u) => {
                        await adminUsersService.enable(u.id);
                        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isDisabled: false } : x)));
                    }}
                />
            )}

            <ConfirmModal
                open={confirmOpen}
                message={`¿Deshabilitar a "${selectedUser?.fullName}"?`}
                onConfirm={confirmDisable}
                onCancel={closeConfirm}
            />
            <ConfirmModal
                open={confirmProductOpen}
                message={`¿Eliminar el producto "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDeleteProduct}
                onCancel={closeDeleteProductConfirm}
            />
            <ConfirmModal
                open={confirmCategoryOpen}
                message={`¿Eliminar la categoría "${selectedCategory?.name}"? \n (Si hay productos con esta categoría no podrá ser eliminada).`}
                onConfirm={confirmDeleteCategory}
                onCancel={closeDeleteCategoryConfirm}
            />

        </AdminLayout>
    );
}