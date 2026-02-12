"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import ProductsRender from "../components/ProductsRender";
import FooterContact from "../components/FooterContact";
import FiltersSidebar from "../components/FiltersSidebar";
import { ProductFilters } from "@/lib/types/filters";
import { Category } from "@/lib/types/category";
import { categoryService } from "@/lib/api/category";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const searchParams = useSearchParams();

    const categoryIdFromUrl = searchParams.get("categoryId");
    const sortFromUrl = searchParams.get("sort");

    const initialFilters = useMemo<ProductFilters>(
        () => ({
            categoryId: categoryIdFromUrl ? Number(categoryIdFromUrl) : null, // Redirecciones de la pagina principal a products.
            minPrice: null,
            maxPrice: null,
            sort: (sortFromUrl as any) ?? "popular",
            search: "",
        }),
        [categoryIdFromUrl, sortFromUrl]
    );
    const [filters, setFilters] = useState<ProductFilters>(initialFilters);

    useEffect(() => {
        categoryService.getAll().then(setCategories).catch(console.error);
    }, []);

    // Si cambia la URL (ej: /products?categoryId=2) sincroniza filtros, por las dudas.
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const clearFilters = () =>
        setFilters({ categoryId: null, minPrice: null, maxPrice: null, sort: "popular", search: "" });

    return (
        <div id="top" className="min-h-screen text-black bg-gray-200">

            <Header />

            <section className="px-3 sm:px-4 lg:px-6 pb-4">
                <div className="mx-auto max-w-auto flex flex-col lg:flex-row gap-3 lg:gap-6">

                    {/* MOBILE */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setFiltersOpen((v) => !v)}
                            className="
                                w-full bg-white border border-gray-200 rounded-xl shadow-sm
                                px-4 py-3 flex items-center justify-between
                                text-sm font-semibold hover:bg-gray-50
                            "
                            type="button"
                        >
                            <span>{filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}</span>
                            <span className="text-gray-400">{filtersOpen ? "▲" : "▼"}</span>
                        </button>

                        <div
                            className={`
                                overflow-hidden transition-all duration-200
                                ${filtersOpen ? "max-h-[900px] mt-3" : "max-h-0 mt-0"}
                            `}
                        >
                            <FiltersSidebar
                                categories={categories}
                                value={filters}
                                onChange={setFilters}
                                onClear={clearFilters}
                                variant="mobile"
                            />
                        </div>
                    </div>

                    {/* DESKTOP*/}
                    <div className="hidden lg:block lg:w-72 lg:shrink-0">
                        <FiltersSidebar
                            categories={categories}
                            value={filters}
                            onChange={setFilters}
                            onClear={clearFilters}
                            variant="desktop"
                        />
                    </div>

                    <main className="flex-1 min-w-0">
                        <ProductsRender filters={filters} />
                    </main>

                </div>
            </section>

            <div id="contact" className="pt-2">
                <FooterContact />
            </div>

        </div>
    );
}