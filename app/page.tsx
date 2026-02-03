"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductsRender from "./components/ProductsRender";
import FooterContact from "./components/FooterContact";
import FiltersSidebar from "./components/FiltersSidebar";
import { ProductFilters } from "@/lib/types/filters";
import { Category } from "@/lib/types/category";
import { categoryService } from "@/lib/api/category";

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<ProductFilters>({
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        sort: null,
        search: "",
    });

    useEffect(() => {
        categoryService.getAll().then(setCategories).catch(console.error);
    }, []);

    const clearFilters = () =>
        setFilters({ categoryId: null, minPrice: null, maxPrice: null, sort: null, search: "" });

    return (
        // Los IDs sirven para poder mover la scrollbar e ir a las secciones (contacto, top, etc).
        <div id="top" className="min-h-screen text-black bg-gray-200">
            <Header />

            {/* Layout de filtros + productos */}
            <section className="px-4 pb-4">
                <div className="flex flex-col lg:flex-row gap-1">
                    <FiltersSidebar
                        categories={categories}
                        value={filters}
                        onChange={setFilters}
                        onClear={clearFilters}
                    />

                    <main className="flex-1">
                        <ProductsRender filters={filters} />
                    </main>
                </div>
            </section>

            <div id="contact">
                <FooterContact />
            </div>
        </div>
    );
}