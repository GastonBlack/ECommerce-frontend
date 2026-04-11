"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/api/products";
import ProductModal from "./ProductModal";
import { Product } from "@/lib/types/product";
import { ProductFilters } from "@/lib/types/filters";
import Pagination from "./Pagination";
import { scrollToId } from "@/lib/utils/generalUtils";

type Props = {
    filters?: ProductFilters;
};

export default function ProductsRender({ filters }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Cuando cambian los filtros, vuelve a la página 1.
    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            setLoading(true);

            try {
                const data = await productService.getAll({
                    page,
                    pageSize: 25,
                    sort: filters?.sort ?? "popular",
                    categoryId: filters?.categoryId ?? null,
                    minPrice: filters?.minPrice ?? null,
                    maxPrice: filters?.maxPrice ?? null,
                    search: filters?.search ?? "",
                });

                if (cancelled) return;

                setProducts(data.items);
                setTotalPages(data.totalPages);
            } catch (error) {
                if (cancelled) return;
                console.error(error);
                setProducts([]);
                setTotalPages(1);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
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

            {loading ? (
                <div
                    className="grid gap-4 sm:gap-6 items-stretch"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(16rem, auto))" }}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col bg-white shadow-sm rounded-md h-full overflow-hidden"
                        >
                            <div className="w-full aspect-square bg-gray-200 animate-pulse" />

                            <div className="flex w-full items-center justify-center">
                                <div className="w-[60%] h-[1px] bg-black opacity-10" />
                            </div>

                            <div className="w-full px-4 py-3 flex flex-col flex-1">
                                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                                <div className="mt-2 h-4 w-full bg-gray-100 rounded animate-pulse" />
                                <div className="mt-1 h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                                <div className="mt-auto pt-4">
                                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-lg font-semibold text-gray-800">
                        No se encontraron productos
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Probá cambiando los filtros o limpiando la búsqueda.
                    </p>
                </div>
            ) : (
                <div
                    className="grid gap-4 sm:gap-6 items-stretch"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(16rem, auto))" }}
                >
                    {products.map((p: Product) => (
                        <div
                            key={p.id}
                            className={`
                                relative
                                flex flex-col cursor-pointer bg-white shadow-sm rounded-md
                                hover:shadow-md hover:shadow-2xl hover:scale-[1.01] transition
                                h-full overflow-hidden
                                lg:max-w-70
                                ${p.stock === 0 ? "opacity-60" : ""}
                            `}
                            onClick={() => setSelectedProduct(p)}
                        >

                            {p.stock === 0 && (
                                <div className="absolute top-2 left-2 z-20">
                                    <span className="bg-black text-white text-xs px-2 py-1 rounded-md shadow">
                                        Sin stock
                                    </span>
                                </div>
                            )}

                            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                                {p.imageUrl ? (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-full object-contain"
                                    />
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

            <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(newPage) => setPage(newPage)}
            />

        </section>
    );
}