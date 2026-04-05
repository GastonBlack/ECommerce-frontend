"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Search, ChevronDown } from "lucide-react";
import Pagination from "@/app/components/Pagination";
import { scrollToId } from "@/lib/utils/generalUtils";

import type { Category } from "@/lib/types/category";
import type { AdminProduct } from "@/lib/types/adminProduct";

type StockSort = "none" | "asc" | "desc";

export type AdminProductsFilters = {
    nameQuery?: string;
    categoryId?: number;
    stockSort?: StockSort;
};

interface ProductsTableProps {
    loading?: boolean;
    products: AdminProduct[];
    categories: Category[];

    onEdit: (p: AdminProduct) => void;
    onDeleteRequest: (p: AdminProduct) => void;

    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    
    onFiltersApply: (f: AdminProductsFilters) => void;
    appliedFilters?: AdminProductsFilters;
}

export default function ProductsTable({
    loading,
    products,
    categories,
    onEdit,
    onDeleteRequest,
    page,
    totalPages,
    onPageChange,
    onFiltersApply,
    appliedFilters,
}: ProductsTableProps) {
    const [nameQuery, setNameQuery] = useState(appliedFilters?.nameQuery ?? "");
    const [categoryId, setCategoryId] = useState<number>(appliedFilters?.categoryId ?? 0);
    const [stockSort, setStockSort] = useState<StockSort>(appliedFilters?.stockSort ?? "none");

    useEffect(() => {
        if (!appliedFilters) return;
        setNameQuery(appliedFilters.nameQuery ?? "");
        setCategoryId(appliedFilters.categoryId ?? 0);
        setStockSort(appliedFilters.stockSort ?? "none");
    }, [appliedFilters?.nameQuery, appliedFilters?.categoryId, appliedFilters?.stockSort]);

    const categoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? "—";

    const hasFilters = useMemo(() => {
        return (
            (nameQuery?.trim()?.length ?? 0) > 0 ||
            categoryId !== 0 ||
            stockSort !== "none"
        );
    }, [nameQuery, categoryId, stockSort]);

    const applyFilters = () => {
        onFiltersApply({ nameQuery, categoryId, stockSort });
    };

    const clearFilters = () => {
        setNameQuery("");
        setCategoryId(0);
        setStockSort("none");
        onFiltersApply({ nameQuery: "", categoryId: 0, stockSort: "none" });
    };

    const toggleStockSortAndApply = () => {
        const next: StockSort =
            stockSort === "none" ? "asc" : stockSort === "asc" ? "desc" : "none";

        setStockSort(next);
        onFiltersApply({ nameQuery, categoryId, stockSort: next });
    };

    return (
        <div className="flex flex-col w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 md:px-5 py-4 flex items-center justify-between border-b border-gray-200 gap-3">
                <div>
                    <h2 className="font-semibold">Productos</h2>
                    <p className="text-xs text-gray-500">
                        Página {page} de {Math.max(totalPages, 1)}
                    </p>
                </div>

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="px-4 md:px-5 py-4 border-b border-gray-200 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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

                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 cursor-pointer"
                    >
                        Aplicar filtros
                    </button>
                </div>

                {loading && <p className="mt-3 text-xs text-gray-500">Cargando...</p>}
            </div>

            <div className="md:hidden p-3 space-y-3">
                {products.length === 0 && (
                    <div className="py-8 text-center text-gray-500 text-sm">
                        No hay productos con esos filtros.
                    </div>
                )}

                {products.map((p) => (
                    <div
                        key={p.id}
                        className="rounded-xl border border-gray-200 p-3 shadow-sm"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
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

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm break-words">{p.name}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {p.description}
                                </p>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-400">ID:</span>{" "}
                                        <span className="font-medium">{p.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Stock:</span>{" "}
                                        <span className="font-medium">{p.stock}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Precio:</span>{" "}
                                        <span className="font-medium">U$S {p.price}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Categoría:</span>{" "}
                                        <span className="font-medium">{categoryName(p.categoryId)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => {
                                    onEdit(p);
                                    scrollToId("adminTop");
                                }}
                                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer"
                                title="Editar"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => onDeleteRequest(p)}
                                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer text-red-600"
                                title="Eliminar"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 w-[70px]">Id</th>
                            <th className="text-left px-4 py-3">Producto</th>
                            <th className="text-left px-4 py-3">Categoría</th>
                            <th className="text-left px-4 py-3">Precio</th>
                            <th className="text-left px-4 py-3">
                                <button
                                    onClick={toggleStockSortAndApply}
                                    className="flex items-center gap-1 hover:text-black text-gray-600 cursor-pointer"
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
                        {products.map((p) => (
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
                                            <p className="font-medium truncate max-w-[320px]">
                                                {p.name}
                                            </p>
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
                                                onEdit(p);
                                                scrollToId("adminTop");
                                            }}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDeleteRequest(p)}
                                            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-white cursor-pointer text-red-600"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                                    No hay productos con esos filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-4 pb-4 pt-4">
                    <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
                </div>
            )}
        </div>
    );
}