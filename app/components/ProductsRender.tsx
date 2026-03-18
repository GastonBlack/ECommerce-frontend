"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/api/products";
import ProductModal from "./ProductModal";
import { Product } from "@/lib/types/product";
import { ProductFilters } from "@/lib/types/filters";
import Pagination from "./Pagination";
import { scrollToId } from "@/lib/api/utils/generalUtils";

type Props = {
    filters?: ProductFilters;
};

export default function ProductsRender({ filters }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Cuando cambian los filtros, vuelve a la página 1.
    useEffect(() => {
        setPage(1);
    }, [filters]);

    // Carga productos desde el backend (ya filtrados + ordenados + paginados).
    useEffect(() => {
        productService
            .getAll({
                page,
                pageSize: 25,
                sort: filters?.sort ?? "popular",
                categoryId: filters?.categoryId ?? null,
                minPrice: filters?.minPrice ?? null,
                maxPrice: filters?.maxPrice ?? null,
                search: filters?.search ?? "",
            })
            .then((data) => {
                setProducts(data.items);
                setTotalPages(data.totalPages);
            })
            .catch(console.error);
    }, [page, filters]);

    // Cada vez que cambia de filtro/página, sube para arriba del todo.
    useEffect(() => {
        scrollToId("top");
    }, [filters, page]);

    return (
        <section id="products" className="w-full px-3 sm:px-6 lg:px-8 mt-4 pb-4">
            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {products.length === 0 ? (
                <p className="text-gray-500">Cargando productos...</p>
            ) : (
                <div
                    className="grid gap-4 sm:gap-6 items-stretch"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}
                >
                    {products.map((p: Product) => (
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

            <Pagination page={page} totalPages={totalPages} onChange={(newPage) => setPage(newPage)} />

        </section>
    );
}