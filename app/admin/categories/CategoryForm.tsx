"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { categoryService } from "@/lib/api/category";
import { useNotification } from "@/app/components/NotificationProvider";

import type { Category } from "@/lib/types/category";

interface CategoryFormProps {
    open: boolean;
    category: Category | null;
    onSaved: () => void;
    onCancel: () => void;
}

export default function CategoryForm({
    open,
    category,
    onSaved,
    onCancel,
}: CategoryFormProps) {
    const { showNotification } = useNotification();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        if (category) {
            setName(category.name);
            setError("");
        } else {
            setName("");
            setError("");
        }
    }, [category, open]);

    useEffect(() => {
        if (!open) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    const handleSave = async () => {
        if (name.trim().length < 2) {
            setError("Mínimo 2 caracteres.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            if (category) {
                await categoryService.update(category.id, { name: name.trim() });
                showNotification("Categoría modificada correctamente.", "success");
            } else {
                await categoryService.create({ name: name.trim() });
                showNotification("Categoría agregada correctamente.", "success");
            }

            onSaved();
            setName("");
        } catch (e: any) {
            const msg = e?.response?.data?.error || "Error al guardar.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const close = () => {
        if (saving) return;
        onCancel();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={close}
            />

            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {category ? "Editar categoría" : "Nueva categoría"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {category
                                ? "Modificá el nombre de la categoría."
                                : "Completá los datos para crear una categoría."}
                        </p>
                    </div>

                    <button
                        onClick={close}
                        className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {error && (
                        <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                            Nombre
                        </label>
                        <input
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-black transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Calzado Deportivo"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
                    <button
                        onClick={close}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {saving ? (
                            "Procesando..."
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {category ? "Actualizar" : "Crear"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}