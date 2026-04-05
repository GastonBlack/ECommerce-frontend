"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import { categoryService } from "@/lib/api/category";
import type { Category } from "@/lib/types/category";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useNotification } from "@/app/components/NotificationProvider";

export default function CategoriesManager() {
    const { showNotification } = useNotification();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formOpen, setFormOpen] = useState(false);

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
            showNotification(
                "Error al intentar eliminar la categoría. Verificá que no haya productos vinculados.",
                "error"
            );
            setShowConfirmModal(false);
        }
    };

    const openCreateModal = () => {
        setSelectedCategory(null);
        setFormOpen(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormOpen(true);
    };

    const closeFormModal = () => {
        setFormOpen(false);
        setSelectedCategory(null);
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="flex flex-col gap-4 w-full" id="adminTop">

            <div className="flex items-center justify-center">
                <button
                    onClick={openCreateModal}
                    className="flex h-11 w-11 items-center justify-center rounded-sm bg-black text-white shadow-sm hover:opacity-90 cursor-pointer"
                    title="Agregar categoría"
                    aria-label="Agregar categoría"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-4 md:px-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">Categorías</h2>
                            <p className="text-xs text-gray-500">
                                {filteredCategories.length} resultado
                                {filteredCategories.length === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 px-4 py-4 md:px-5">
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
                </div>

                <div className="px-3 py-3 md:px-0 md:py-0">
                    <CategoriesTable
                        categories={filteredCategories}
                        onEdit={openEditModal}
                        onDeleteRequest={openDeleteModal}
                    />
                </div>
            </div>

            <CategoryForm
                open={formOpen}
                category={selectedCategory}
                onSaved={async () => {
                    closeFormModal();
                    await refreshData();
                }}
                onCancel={closeFormModal}
            />

            <ConfirmModal
                open={showConfirmModal}
                message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? No podrás eliminarla si hay productos vinculados.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
}