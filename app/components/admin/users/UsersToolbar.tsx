"use client";

export default function UsersToolbar({
    query,
    onQueryChange,
    onReload,
    loading,
}: {
    query: string;
    onQueryChange: (v: string) => void;
    onReload: () => void;
    loading: boolean;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full sm:max-w-md border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />

            <button
                onClick={onReload}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50 cursor-pointer text-sm"
            >
                {loading ? "Cargando..." : "Recargar"}
            </button>
        </div>
    );
}