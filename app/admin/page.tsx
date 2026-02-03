"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/app/components/admin/AdminLayout";
import ProductsTable from "../components/admin/products/ProductsTable";
import ProductForm from "../components/admin/products/ProductForm";
import CategoriesTable from "../components/admin/categories/CategoriesTable";
import CategoryForm from "../components/admin/categories/CategoryForm";
import UsersSection from "../components/admin/users/UsersSection";

import { productService } from "@/lib/api/products";
import { categoryService } from "@/lib/api/category";
import { getUserFromToken } from "@/lib/helpers/jwt/getUserFromToken";
import { adminUsersService } from "@/lib/api/adminUsers";

import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import type { AdminUser } from "@/lib/types/adminUser";

export type AdminTab = "products" | "categories" | "orders" | "users";

export default function AdminPage() {
    const router = useRouter();

    const [tab, setTab] = useState<AdminTab>("products");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [users, setUsers] = useState<AdminUser[]>([]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Validar Usuario 
    useEffect(() => {
        const user = getUserFromToken();

        if (user == null) router.push("/login");
        else if (user.rol !== "Admin") router.push("/");
    }, [router]);
    // ======================================================

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

    // Deshabilitar Usuario.
    const disableUser = async (u: AdminUser) => {
        if (!confirm(`¿Deshabilitar a "${u.fullName}"?`)) return;
        await adminUsersService.disable(u.id);
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isDisabled: true } : x)));
    };

    // Habilitar Usuario.
    const enableUser = async (u: AdminUser) => {
        await adminUsersService.enable(u.id);
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isDisabled: false } : x)));
    };

    useEffect(() => {
        reloadAll();
    }, []);

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
                            onDeleted={reloadAll}
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
                            onDeleted={reloadAll}
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
                    <p className="text-sm text-gray-600">
                        TODO: FALTA IMPLEMENTAR.
                    </p>
                </div>
            )}

            {tab === "users" && (
                <UsersSection
                    users={users}
                    loading={loading}
                    error={error}
                    onReload={reloadAll}
                    onDisable={disableUser}
                    onEnable={enableUser}
                />
            )}

        </AdminLayout>
    );
}