"use client";

import { useEffect, useState, useMemo } from "react";
import { productService } from "@/lib/api/products";
import ProductModal from "./ProductModal";
import { Product } from "@/lib/types/product";
import { ProductFilters } from "@/lib/types/filters";

type Props = {
    filters?: ProductFilters;
};

export default function ProductsRender({ filters }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const sortToBackend = filters?.sort === "popular" ? "popular" : undefined;

        productService
            .getAll(sortToBackend)
            .then(setProducts)
            .catch(console.error);
    }, [filters?.sort]);

    /* SECCION DE FILTROS */
    // ===============================================
    const filtered = useMemo(() => {
        let list = [...products];

        if (filters?.categoryId) {
            list = list.filter((p: any) => p.categoryId === filters.categoryId);
        }

        if (filters?.minPrice != null) list = list.filter((p) => p.price >= filters.minPrice!);
        if (filters?.maxPrice != null) list = list.filter((p) => p.price <= filters.maxPrice!);

        if (filters?.search) {
            const q = filters.search.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(q));
        }

        switch (filters?.sort) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                list.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "popular":
                // Lo ordena el backend usando el TotalSold para que el usuario comun no pueda acceder al dato.
                break;
        }

        return list;
    }, [products, filters]);
    // ===================================================================================================

    return (
        <section id="products" className="w-full px-3 sm:px-6 lg:px-8 mt-4 pb-4">

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {products.length === 0 ? (
                <p className="text-gray-500">Cargando productos...</p>
            ) : (
                <div
                    className="grid gap-4 sm:gap-6 bg-gray-200 items-stretch"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                    }}
                >
                    {filtered.map((p: Product) => (
                        <div
                            key={p.id}
                            className="
                                flex flex-col cursor-pointer bg-white shadow-sm rounded-md
                                hover:shadow-md hover:shadow-2xl hover:scale-[1.01] transition
                                h-full overflow-hidden
                            "
                            onClick={() => setSelectedProduct(p)}
                        >
                            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-gray-400 text-sm">Sin imagen</span>
                                )}
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <div className="w-[60%] h-[1px] bg-black opacity-20" />
                            </div>

                            <div className="w-full px-4 py-3 flex flex-col flex-1">
                                <p className="text-sm sm:text-base font-medium line-clamp-2 min-h-[44px]">
                                    {p.name}
                                </p>
                                <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 min-h-[36px]">
                                    {p.description}
                                </p>
                                <p className="mt-auto text-black font-semibold text-lg sm:text-xl pt-3">
                                    U$S {p.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </section>
    );
}