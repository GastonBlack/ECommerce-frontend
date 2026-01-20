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
        productService.getAll().then(setProducts).catch(console.error);
    }, []);

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
        }

        return list;
    }, [products, filters]);
    // ===================================================================================================

    return (
        <section id="products" className="w-full px-8 mt-4 pb-4">
            {products.length === 0 ? (
                <p className="text-gray-500">Cargando productos...</p>
            ) : (
                <div
                    className="grid gap-10 gap-y-5 bg-gray-200 justify-start"
                    style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 16rem))",
                    }}
                >
                    {filtered.map((p: Product) => (

                        <div key={p.id}
                            className="
                                flex flex-col cursor-pointer w-70 bg-white shadow-sm rounded-md items-center
                                hover:shadow-md hover:shadow-2xl hover:scale-101 transition
                            "
                            onClick={() => setSelectedProduct(p)}
                        >

                            {/* Imagen */}
                            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                                {p.imageUrl ? (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-6"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">Sin imagen</span>
                                )}
                            </div>

                            <div className="w-[60%] h-[1px] bg-black opacity-30"></div>

                            <div className="w-full px-4">
                                <p className="mt-3 text-md font-small">{p.name}</p>

                                <p className="text-black font-medium text-lg mb-3">U$S {p.price}</p>
                            </div>

                        </div>
                    ))}

                    {/*MODAL */}
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />

                </div>
            )}
        </section>
    )
}