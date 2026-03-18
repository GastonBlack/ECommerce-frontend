import ProductsManager from "./ProductManager";
import { serverFetch } from "@/lib/api/serverFetch";
import type { Category } from "@/lib/types/category";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { PagedResult } from "@/lib/types/PagedResult";

export default async function AdminProductsPage() {
    const [categoriesRes, productsRes] = await Promise.all([
        serverFetch("/category"),
        serverFetch("/product/admin?page=1&pageSize=25&sort=name-asc"),
    ]);

    if (!categoriesRes.ok) {
        const text = await categoriesRes.text();
        throw new Error(`Error cargando categorías: ${categoriesRes.status} ${text}`);
    }

    if (!productsRes.ok) {
        const text = await productsRes.text();
        throw new Error(`Error cargando productos: ${productsRes.status} ${text}`);
    }

    const initialCategories: Category[] = await categoriesRes.json();
    const initialProductsPage: PagedResult<AdminProduct> = await productsRes.json();

    return (
        <main className="max-w-8xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Productos</h1>
                <p className="text-gray-500 text-sm">Gestiona el catálogo de productos.</p>
            </div>

            <ProductsManager
                initialCategories={initialCategories}
                initialProductsPage={initialProductsPage}
            />
        </main>
    );
}