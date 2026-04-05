"use client";

import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { productService } from "@/lib/api/products";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { Category } from "@/lib/types/category";

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
    open,
    product,
    categories,
    onSaved,
    onCancel,
}: {
    open: boolean;
    product: AdminProduct | null;
    categories: Category[];
    onSaved: () => void;
    onCancel: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [form, setForm] = useState<FormState>(empty);

    useEffect(() => {
        if (!open) return;

        setError("");
        setFile(null);

        if (product) {
            setForm({
                name: product.name,
                description: product.description ?? "",
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
                imageUrl: product.imageUrl ?? "",
            });
        } else {
            setForm(empty);
        }
    }, [open, product]);

    useEffect(() => {
        if (!open) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    const close = () => {
        if (saving) return;
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
        if (!form.imageUrl.trim()) return setError("Elegí una imagen.");

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

            onSaved();
        } catch (e: any) {
            setError(
                e?.response?.data?.error ||
                (e?.response?.data?.errors
                    ? "Error de validación."
                    : "Error guardando producto.")
            );
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={close}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {product?.id ? "Editar producto" : "Nuevo producto"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {product?.id
                                ? "Modificá la información del producto."
                                : "Completá los datos para crear un producto."}
                        </p>
                    </div>

                    <button
                        onClick={close}
                        className="rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                        title="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto p-5 space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Field label="Nombre">
                        <input
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.name}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, name: e.target.value }))
                            }
                        />
                    </Field>

                    <Field label="Descripción">
                        <textarea
                            className="min-h-[100px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.description}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Precio (U$S)">
                            <input
                                type="number"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                value={form.price}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        price: Number(e.target.value),
                                    }))
                                }
                            />
                        </Field>

                        <Field label="Stock">
                            <input
                                type="number"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        stock: Number(e.target.value),
                                    }))
                                }
                            />
                        </Field>
                    </div>

                    <Field label="Categoría">
                        <select
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    categoryId: Number(e.target.value),
                                }))
                            }
                        >
                            <option value={0}>Elegí una categoría...</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <div className="rounded-xl border border-gray-200 p-3">
                        <label className="mb-2 block text-xs font-semibold text-gray-600">
                            Imagen del producto
                        </label>

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
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                {form.imageUrl ? (
                                    <img
                                        src={form.imageUrl}
                                        alt="preview"
                                        className="h-full w-full object-contain p-1"
                                    />
                                ) : (
                                    <span className="px-2 text-center text-[11px] text-gray-400">
                                        Sin imagen
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById(
                                            "product-image-input"
                                        ) as HTMLInputElement | null;
                                        input?.click();
                                    }}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                >
                                    <Upload className="h-4 w-4" />
                                    Elegir imagen
                                </button>

                                <div className="mt-2 text-xs text-gray-500">
                                    {form.imageUrl ? (
                                        <>
                                            <span className="font-semibold text-gray-700">
                                                Reemplazar:
                                            </span>{" "}
                                            elegí una nueva imagen y se actualizará
                                            automáticamente.
                                        </>
                                    ) : (
                                        <>Subí una imagen.</>
                                    )}
                                </div>

                                {file && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        Archivo seleccionado:{" "}
                                        <span className="font-semibold">
                                            {file.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
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
                        onClick={save}
                        disabled={saving}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? "Guardando..." : product?.id ? "Guardar cambios" : "Crear producto"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
                {label}
            </label>
            {children}
        </div>
    );
}