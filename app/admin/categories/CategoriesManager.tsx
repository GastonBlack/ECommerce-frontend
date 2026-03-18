"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import { categoryService } from "@/lib/api/category";
import type { Category } from "@/lib/types/category";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useNotification } from "@/app/components/NotificationProvider";

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
    const { showNotification } = useNotification();

    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const filteredCategories = useMemo(() => {
        return categories.filter((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const refreshData = useCallback(async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
            setSelectedCategory(null);
            setCategoryToDelete(null);
        } catch {
            showNotification("Error cargando categorías.", "error");
        }
    }, [showNotification]);

    const openDeleteModal = (category: Category) => {
        setCategoryToDelete(category);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await categoryService.remove(categoryToDelete.id);
            await refreshData();
            setShowConfirmModal(false);
            showNotification("Categoría eliminada correctamente.", "success");
        } catch {
            showNotification("Error al intentar eliminar la categoría. Verificá que no haya productos vinculados.","error");
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <CategoriesTable
                    categories={filteredCategories}
                    onEdit={setSelectedCategory}
                    onDeleteRequest={openDeleteModal}
                />
            </div>

            <div className="lg:col-span-1">
                <CategoryForm
                    category={selectedCategory}
                    onSaved={refreshData}
                    onCancel={() => setSelectedCategory(null)}
                />
            </div>

            <ConfirmModal
                open={showConfirmModal}
                message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? No podrás eliminarla si hay productos vinculados.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
}