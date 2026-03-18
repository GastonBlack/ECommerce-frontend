import ProductsManager from "./ProductManager";

export default function AdminProductsPage() {
    return (
        <main className="max-w-8xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Productos</h1>
                <p className="text-gray-500 text-sm">Gestiona el catálogo de productos.</p>
            </div>

            <ProductsManager />
        </main>
    );
}