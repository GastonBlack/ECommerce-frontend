"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib/types/category";
import { ProductFilters, SortOption } from "@/lib/types/filters";

type Props = {
    categories: Category[];
    value: ProductFilters;
    onChange: (next: ProductFilters) => void;
    onClear: () => void;
    variant?: "mobile" | "desktop";
};

export default function FiltersSidebar({
    categories,
    value,
    onChange,
    onClear,
    variant = "desktop",
}: Props) {
    const set = (patch: Partial<ProductFilters>) => onChange({ ...value, ...patch });

    const [minPriceInput, setMinPriceInput] = useState<string>(
        value.minPrice != null ? String(value.minPrice) : ""
    );
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        value.maxPrice != null ? String(value.maxPrice) : ""
    );

    useEffect(() => {
        setMinPriceInput(value.minPrice != null ? String(value.minPrice) : "");
    }, [value.minPrice]);

    useEffect(() => {
        setMaxPriceInput(value.maxPrice != null ? String(value.maxPrice) : "");
    }, [value.maxPrice]);

    const applyPriceFilters = () => {
        set({
            minPrice: minPriceInput.trim() === "" ? null : Number(minPriceInput),
            maxPrice: maxPriceInput.trim() === "" ? null : Number(maxPriceInput),
        });
    };

    const handleClear = () => {
        setMinPriceInput("");
        setMaxPriceInput("");
        onClear();
    };

    return (
        <aside
            className={`
                w-full bg-white border border-gray-200 shadow-sm rounded-2xl
                p-4 sm:p-5
                ${variant === "desktop" ? "sticky top-20" : ""}
            `}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold">Filtros</h2>

                <button
                    onClick={handleClear}
                    className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    type="button"
                >
                    Limpiar
                </button>
            </div>

            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Categorías</p>

                <div
                    className="lg:hidden flex gap-2 overflow-x-auto pb-1"
                    style={{ scrollbarWidth: "none" }}
                >
                    <button
                        className={`
                            shrink-0 text-sm px-4 py-2 rounded-lg border
                            ${!value.categoryId
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-gray-50 border-gray-200"
                            }
                        `}
                        onClick={() => set({ categoryId: null })}
                        type="button"
                    >
                        Todas
                    </button>

                    {categories.map((c) => (
                        <button
                            key={c.id}
                            className={`
                                shrink-0 text-sm px-4 py-2 rounded-lg border cursor-pointer
                                ${value.categoryId === c.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white hover:bg-gray-50 border-gray-200"
                                }
                            `}
                            onClick={() => set({ categoryId: c.id })}
                            type="button"
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="hidden lg:flex flex-col gap-2">
                    <button
                        className={`
                            text-left text-sm px-3 py-2 rounded-lg border
                            ${!value.categoryId
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-gray-50 border-gray-200"
                            }
                        `}
                        onClick={() => set({ categoryId: null })}
                        type="button"
                    >
                        Todas
                    </button>

                    {categories.map((c) => (
                        <button
                            key={c.id}
                            className={`
                                text-left cursor-pointer text-sm px-3 py-2 rounded-lg border
                                ${value.categoryId === c.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white hover:bg-gray-50 border-gray-200"
                                }
                            `}
                            onClick={() => set({ categoryId: c.id })}
                            type="button"
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Precio</p>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                    />
                </div>

                <button
                    onClick={applyPriceFilters}
                    className="mt-3 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 cursor-pointer"
                    type="button"
                >
                    Aplicar precio
                </button>
            </div>

            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Orden</p>
                <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 cursor-pointer bg-white"
                    value={value.sort ?? ""}
                    onChange={(e) =>
                        set({ sort: (e.target.value || null) as SortOption | null })
                    }
                >
                    <option value="popular">Populares</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                </select>
            </div>

            <div className="lg:hidden">
                <button
                    onClick={handleClear}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    type="button"
                >
                    Limpiar filtros
                </button>
            </div>
        </aside>
    );
}