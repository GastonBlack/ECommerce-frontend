"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import ProductsRender from "../components/ProductsRender";
import FooterContact from "../components/FooterContact";
import FiltersSidebar from "../components/FiltersSidebar";
import { ProductFilters } from "@/lib/types/filters";
import { Category } from "@/lib/types/category";
import { categoryService } from "@/lib/api/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductsPageClient() {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const categoryIdFromUrl = searchParams.get("categoryId");
    const sortFromUrl = searchParams.get("sort");
    const minPriceFromUrl = searchParams.get("minPrice");
    const maxPriceFromUrl = searchParams.get("maxPrice");
    const searchFromUrl = searchParams.get("search");

    const initialFilters = useMemo<ProductFilters>(
        () => ({
            categoryId: categoryIdFromUrl ? Number(categoryIdFromUrl) : null,
            minPrice: minPriceFromUrl ? Number(minPriceFromUrl) : null,
            maxPrice: maxPriceFromUrl ? Number(maxPriceFromUrl) : null,
            sort: (sortFromUrl as any) ?? "popular",
            search: searchFromUrl ?? "",
        }),
        [categoryIdFromUrl, minPriceFromUrl, maxPriceFromUrl, sortFromUrl, searchFromUrl]
    );

    const [filters, setFilters] = useState<ProductFilters>(initialFilters);

    useEffect(() => {
        categoryService.getAll().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const updateUrlWithFilters = (nextFilters: ProductFilters) => {
        const params = new URLSearchParams(searchParams.toString());

        if (nextFilters.categoryId) params.set("categoryId", String(nextFilters.categoryId));
        else params.delete("categoryId");

        if (nextFilters.minPrice != null) params.set("minPrice", String(nextFilters.minPrice));
        else params.delete("minPrice");

        if (nextFilters.maxPrice != null) params.set("maxPrice", String(nextFilters.maxPrice));
        else params.delete("maxPrice");

        if (nextFilters.sort && nextFilters.sort !== "popular") params.set("sort", nextFilters.sort);
        else params.delete("sort");

        if (nextFilters.search?.trim()) params.set("search", nextFilters.search.trim());
        else params.delete("search");

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const handleFiltersChange = (nextFilters: ProductFilters) => {
        setFilters(nextFilters);
        updateUrlWithFilters(nextFilters);
    };

    const clearFilters = () => {
        const cleared: ProductFilters = {
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            sort: "popular",
            search: "",
        };

        setFilters(cleared);
        updateUrlWithFilters(cleared);
    };

    return (
        <div id="top" className="min-h-screen text-black bg-gray-200">
            <Header />

            <section className="px-3 sm:px-4 lg:px-6 pb-4">
                <div className="mx-auto max-w-auto flex flex-col lg:flex-row gap-3 lg:gap-6">
                    <div className="lg:hidden">
                        <button
                            onClick={() => setFiltersOpen((v) => !v)}
                            className="w-full bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex items-center justify-between text-sm font-semibold hover:bg-gray-50"
                            type="button"
                        >
                            <span>{filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}</span>
                            <span className="text-gray-400">{filtersOpen ? "▲" : "▼"}</span>
                        </button>

                        <div
                            className={`
                                overflow-hidden transition-all duration-200 
                                ${filtersOpen 
                                    ? "max-h-[900px] mt-3" 
                                    : "max-h-0 mt-0"
                                }
                            `}
                        >
                            <FiltersSidebar
                                categories={categories}
                                value={filters}
                                onChange={handleFiltersChange}
                                onClear={clearFilters}
                                variant="mobile"
                            />
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-72 lg:shrink-0">
                        <FiltersSidebar
                            categories={categories}
                            value={filters}
                            onChange={handleFiltersChange}
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