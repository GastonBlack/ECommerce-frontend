"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { categoryService } from "@/lib/api/category";
import { useNotification } from "@/app/components/NotificationProvider";

import type { Category } from "@/lib/types/category";

interface CategoryFormProps {
    category: Category | null;
    onSaved: () => void;
    onCancel: () => void;
}

export default function CategoryForm({
    category,
    onSaved,
    onCancel,
}: CategoryFormProps) {
    const { showNotification } = useNotification();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setError("");
        } else {
            setName("");
            setError("");
        }
    }, [category]);

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

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">
                    {category ? "Editar" : "Nueva"} Categoría
                </h3>

                {category && (
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {error && (
                    <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                        Nombre
                    </label>
                    <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:bg-white focus:border-black transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Calzado Deportivo"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
    );
}