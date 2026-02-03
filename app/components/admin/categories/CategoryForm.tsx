"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { categoryService } from "@/lib/api/category";
import type { Category } from "@/lib/types/category";

export default function CategoryForm({
    category,
    onSaved,
    onCancel,
}: {
    category: Category | null;
    onSaved: () => void;
    onCancel: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setOpen(true);
            setError("");
            setName(category.name);
        }
    }, [category]);

    const startCreate = () => {
        setOpen(true);
        setError("");
        setName("");
    };

    const close = () => {
        setOpen(false);
        setError("");
        onCancel();
    };

    const save = async () => {
        setError("");
        setSaving(true);

        try {
            if (name.trim().length < 2) return setError("Nombre inválido.");

            if (category?.id) await categoryService.update(category.id, { name });
            else await categoryService.create({ name });

            close();
            onSaved();
        } catch (e: any) {
            setError(e?.response?.data?.error || "Error guardando categoría.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{category?.id ? "Editar categoría" : "Categoría"}</h3>

                <div className="flex items-center gap-2">
                    {!open && (
                        <button
                            onClick={startCreate}
                            className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" /> Nueva
                        </button>
                    )}

                    {open && (
                        <button
                            onClick={close}
                            className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            title="Cerrar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {!open ? (
                <p className="text-sm text-gray-500">
                    Tocá "Nueva" o seleccioná una categoría para editar.
                </p>
            ) : (
                <div className="space-y-3">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
                        <input
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={save}
                        disabled={saving}
                        className="w-full mt-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            )}
        </div>
    );
}