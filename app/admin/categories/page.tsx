import CategoriesManager from "./CategoriesManager";

export default function AdminCategoriesPage() {
    return (
        <main className="p-6 max-w-7xl mx-auto">
            <div id="adminTop" className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Categorías</h1>
                <p className="text-gray-500 text-sm">Gestiona el catálogo de productos.</p>
            </div>

            <CategoriesManager />
        </main>
    );
}