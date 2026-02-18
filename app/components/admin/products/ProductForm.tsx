"use client";

import { useEffect, useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { productService } from "@/lib/api/products";

import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import { useNotification } from "../../NotificationProvider";

type FormState = {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    imageUrl: string;
};

const empty: FormState = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: "",
};

export default function ProductForm({
    product,
    categories,
    onSaved,
    onCancel,
}: {
    product: Product | null;
    categories: Category[];
    onSaved: () => void;
    onCancel: () => void;
}) {
    const { showNotification } = useNotification();

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [form, setForm] = useState<FormState>(empty);

    useEffect(() => {
        if (product) {
            setOpen(true);
            setError("");
            setFile(null);
            setForm({
                name: product.name,
                description: product.description ?? "",
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
                imageUrl: product.imageUrl ?? "",
            });
        }
    }, [product]);

    const startCreate = () => {
        setOpen(true);
        setError("");
        setFile(null);

        setForm({
            ...empty,
            categoryId: 0,
        });
    };

    const close = () => {
        setOpen(false);
        setError("");
        setFile(null);
        onCancel();
    };

    const save = async () => {
        setError("");

        // Validaciones.
        if (form.name.trim().length < 2) return setError("Nombre inválido.");
        if (form.description.trim().length < 2) return setError("Descripción inválida.");
        if (form.price <= 0) return setError("El precio debe ser mayor a 0.");
        if (form.stock < 0) return setError("El stock no puede ser negativo.");
        if (form.categoryId <= 0) return setError("Elegí una categoría.");

        if (!form.imageUrl.trim()) {
            return setError("Elegí una imagen.");
        }

        setSaving(true);

        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId: Number(form.categoryId),
                imageUrl: form.imageUrl.trim(),
            };

            if (product?.id) {
                await productService.update(product.id, payload);
            } else {
                await productService.create(payload);
            }

            close();
            onSaved();
            product?.id ? showNotification("Producto editado con éxito", "success") : showNotification("Producto creador con éxito.", "success");
        } catch (e: any) {
            setError(
                e?.response?.data?.error ||
                (e?.response?.data?.errors ? "Error de validación." : "Error guardando producto.")
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{product?.id ? "Editar producto" : "Producto"}</h3>

                <div className="flex items-center gap-2">
                    {!open && (
                        <button
                            onClick={startCreate}
                            className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" /> Nuevo
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
                <p className="text-sm text-gray-500">Tocá “Nuevo” o seleccioná un producto para editar.</p>
            ) : (
                <div className="space-y-3">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Field label="Nombre">
                        <input
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </Field>

                    <Field label="Descripción">
                        <textarea
                            className="w-full min-h-[90px] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Precio (U$S)">
                            <input
                                type="number"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                                value={form.price}
                                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                            />
                        </Field>

                        <Field label="Stock">
                            <input
                                type="number"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                                value={form.stock}
                                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                            />
                        </Field>
                    </div>

                    <Field label="Categoría">
                        <select
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.categoryId}
                            onChange={(e) => setForm((p) => ({ ...p, categoryId: Number(e.target.value) }))}
                        >
                            <option value={0}>Elegí una categoría...</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* === SECCIÓN IMAGEN === */}
                    <div className="rounded-xl border border-gray-200 p-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Imagen del producto</label>

                        <input
                            id="product-image-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const input = e.currentTarget;
                                const f = input.files?.[0] ?? null;

                                setFile(f);
                                if (!f) return;

                                try {
                                    setError("");
                                    setSaving(true);

                                    const url = await productService.uploadImage(f);
                                    setForm((p) => ({ ...p, imageUrl: url }));
                                } catch {
                                    setError("Error subiendo imagen.");
                                } finally {
                                    setSaving(false);
                                    input.value = "";
                                }
                            }}
                        />

                        <div className="flex items-start gap-3">
                            <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                                {form.imageUrl ? (
                                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-[11px] text-gray-400 text-center px-2">Sin imagen</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById("product-image-input") as HTMLInputElement | null;
                                        input?.click();
                                    }}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm cursor-pointer disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4" />
                                    Elegir imagen
                                </button>

                                <div className="mt-2 text-xs text-gray-500">
                                    {form.imageUrl ? (
                                        <>
                                            <span className="font-semibold text-gray-700">Reemplazar:</span> elegí una nueva imagen y se
                                            actualizará automáticamente.
                                        </>
                                    ) : (
                                        <>Subí una imagen. Se guardará automáticamente.</>
                                    )}
                                </div>

                                {file && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        Archivo seleccionado: <span className="font-semibold">{file.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            {children}
        </div>
    );
}