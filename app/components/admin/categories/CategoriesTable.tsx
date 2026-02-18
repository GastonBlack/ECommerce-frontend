"use client";

import { Pencil, Trash2 } from "lucide-react";
import { categoryService } from "@/lib/api/category";
import type { Category } from "@/lib/types/category";
import { scrollToId } from "@/utils";

export default function CategoriesTable({
    categories,
    onEdit,
    onDeleteRequest,
}: {
    categories: Category[];
    onEdit: (c: Category) => void;
    onDeleteRequest: (c: Category) => void;
}) {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
                <h2 className="font-semibold">Categorías</h2>
                <span className="text-sm text-gray-500">{categories.length} items</span>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3">Nombre</th>
                            <th className="text-right px-4 py-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{c.name}</td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                onEdit(c)
                                                scrollToId("adminTop")
                                            }}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDeleteRequest(c)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer text-red-600"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {categories.length === 0 && (
                            <tr>
                                <td className="px-4 py-10 text-center text-gray-500" colSpan={2}>
                                    No hay categorías.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}