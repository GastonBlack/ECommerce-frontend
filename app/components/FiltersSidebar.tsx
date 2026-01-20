"use client";

import { Category } from "@/lib/types/category";
import { ProductFilters, SortOption } from "@/lib/types/filters";

type Props = {
    categories: Category[];
    value: ProductFilters;
    onChange: (next: ProductFilters) => void;
    onClear: () => void;
};

export default function FiltersSidebar({ categories, value, onChange, onClear }: Props) {
    const set = (patch: Partial<ProductFilters>) => onChange({ ...value, ...patch });

    return (
        <aside className="w-full lg:w-72 bg-white rounded-xl shadow-xl p-4 mt-4 border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>

            {/* Categorias */}
            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Categorías</p>
                <div className="flex flex-col gap-2">
                    <button
                        className={`
                            text-left text-sm px-3 py-2 rounded-lg border cursor-pointer 
                            ${!value.categoryId ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-200"}
                        `}
                        onClick={() => set({ categoryId: null })}
                    >
                        Todas
                    </button>

                    {categories.map((c) => (
                        <button
                            key={c.id}
                            className={`
                                text-left text-sm px-3 py-2 mx-4 rounded-lg border cursor-pointer 
                                ${value.categoryId === c.id ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-200"}
                            `}
                            onClick={() => set({ categoryId: c.id })}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Precio */}
            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Precio</p>

                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={value.minPrice ?? ""}
                        onChange={(e) => set({ minPrice: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={value.maxPrice ?? ""}
                        onChange={(e) => set({ maxPrice: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                </div>
            </div>

            {/* Orden */}
            <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Orden</p>
                <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 cursor-pointer"
                    value={value.sort ?? ""}
                    onChange={(e) => set({ sort: (e.target.value || null) as SortOption | null })}
                >
                    <option value="">Relevancia</option> {/* TODO: agregar productos vendidos y filtrar */}
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                </select>
            </div>

            <button
                onClick={onClear}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer"
            >
                Limpiar filtros
            </button>
        </aside>
    );
}
