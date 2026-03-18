"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types/category";
import { scrollToId } from "@/lib/api/utils/generalUtils";

interface Props {
    categories: Category[];
    onEdit: (c: Category) => void;
    onDeleteRequest: (c: Category) => void;
}

export default function CategoriesTable({
    categories,
    onEdit,
    onDeleteRequest,
}: Props) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-semibold text-gray-700">Listado</h2>
                <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                    {categories.length} resultados
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="text-left px-6 py-3">Nombre de Categoría</th>
                            <th className="text-right px-6 py-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {categories.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {c.name}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                onEdit(c);
                                                scrollToId("adminTop");
                                            }}
                                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDeleteRequest(c)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={2} className="py-12 text-center text-gray-400">
                                    No se encontraron categorías.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}