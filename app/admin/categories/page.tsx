import CategoriesManager from "./CategoriesManager";
import { serverFetch } from "@/lib/api/serverFetch";
import type { Category } from "@/lib/types/category";

export default async function AdminCategoriesPage() {
    const res = await serverFetch("/category");

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error cargando categorías: ${res.status} ${text}`);
    }

    const initialCategories: Category[] = await res.json();

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Categorías</h1>
                <p className="text-gray-500 text-sm">Gestiona el catálogo de productos.</p>
            </div>

            <CategoriesManager initialCategories={initialCategories} />
        </main>
    );
}