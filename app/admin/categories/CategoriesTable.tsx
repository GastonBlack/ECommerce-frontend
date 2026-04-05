"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types/category";
import { scrollToId } from "@/lib/utils/generalUtils";

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
    if (categories.length === 0) {
        return (
            <div className="py-10 text-center text-sm text-gray-400">
                No se encontraron categorías.
            </div>
        );
    }

    return (
        <>
            <div className="md:hidden space-y-3">
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-semibold text-sm break-words">{c.name}</p>
                                <p className="mt-1 text-xs text-gray-400">ID: {c.id}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
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
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="text-left px-6 py-3">Nombre de Categoría</th>
                            <th className="text-right px-6 py-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {categories.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{c.name}</div>
                                    <div className="text-xs text-gray-400">ID: {c.id}</div>
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
                    </tbody>
                </table>
            </div>
        </>
    );
}