"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, ChevronDown } from "lucide-react";
import { productService } from "@/lib/api/products";
import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import { scrollToId } from "@/utils";

type StockSort = "none" | "asc" | "desc";

export default function ProductsTable({
    products,
    categories,
    onEdit,
    onDeleted,
}: {
    products: Product[];
    categories: Category[];
    onEdit: (p: Product) => void;
    onDeleted: () => void;
}) {
    const [idQuery, setIdQuery] = useState("");
    const [nameQuery, setNameQuery] = useState("");
    const [categoryId, setCategoryId] = useState<number>(0); // 0 = todas
    const [stockSort, setStockSort] = useState<StockSort>("none");

    const categoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name ?? "—";

    const remove = async (id: number) => {
        if (!confirm("¿Eliminar producto?")) return;
        await productService.remove(id);
        onDeleted();
    };

    const filteredProducts = useMemo(() => {
        const idQ = idQuery.trim();
        const nameQ = nameQuery.trim().toLowerCase();

        // Filtrar.
        let list = products.filter((p) => {
            const matchId = !idQ || String(p.id).includes(idQ);
            const matchName = !nameQ || p.name.toLowerCase().includes(nameQ);
            const matchCategory = categoryId === 0 || p.categoryId === categoryId;
            return matchId && matchName && matchCategory;
        });

        // Ordenar por stock.
        if (stockSort !== "none") {
            list = [...list].sort((a, b) =>
                stockSort === "asc" ? a.stock - b.stock : b.stock - a.stock
            );
        }

        return list;
    }, [products, idQuery, nameQuery, categoryId, stockSort]);

    const clearFilters = () => {
        setIdQuery("");
        setNameQuery("");
        setCategoryId(0);
        setStockSort("none");
    };

    const toggleStockSort = () => {
        setStockSort((prev) => {
            if (prev === "none") return "asc";
            if (prev === "asc") return "desc";
            return "none";
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
                <div>
                    <h2 className="font-semibold">Productos</h2>
                    <p className="text-xs text-gray-500">
                        {filteredProducts.length} / {products.length} items
                    </p>
                </div>

                {(idQuery.trim() ||
                    nameQuery.trim() ||
                    categoryId !== 0 ||
                    stockSort !== "none") && (
                        <button
                            onClick={clearFilters}
                            className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                            Limpiar filtros
                        </button>
                    )}
            </div>

            <div className="px-5 py-3 border-b border-gray-200 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={idQuery}
                            onChange={(e) => setIdQuery(e.target.value)}
                            placeholder="Buscar por ID..."
                            inputMode="numeric"
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                        />
                    </div>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
                    >
                        <option value={0}>Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 w-[70px]">Id</th>
                            <th className="text-left px-4 py-3">Producto</th>
                            <th className="text-left px-4 py-3">Categoría</th>
                            <th className="text-left px-4 py-3">Precio</th>

                            <th className="text-left px-4 py-3">
                                <button
                                    onClick={toggleStockSort}
                                    className="flex items-center gap-1 hover:text-black text-gray-600"
                                    title="Ordenar por stock"
                                >
                                    <span>Stock</span>

                                    {stockSort === "none" && (
                                        <ChevronDown className="w-4 h-4 opacity-40" />
                                    )}

                                    {stockSort === "desc" && (
                                        <ChevronDown className="w-4 h-4 rotate-180" />
                                    )}

                                    {stockSort === "asc" && (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>

                            <th className="text-right px-4 py-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3">{p.id}</td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                            {p.imageUrl ? (
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-gray-400">No img</span>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-medium truncate max-w-[320px]">{p.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[320px]">
                                                {p.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3">{categoryName(p.categoryId)}</td>
                                <td className="px-4 py-3">U$S {p.price}</td>
                                <td className="px-4 py-3">{p.stock}</td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                onEdit(p)
                                                scrollToId("adminTop")
                                            }}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => remove(p.id)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer text-red-600"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                                    No hay productos que coincidan con los filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}