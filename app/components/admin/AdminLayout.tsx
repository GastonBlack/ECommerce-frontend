"use client";

import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import type { AdminTab } from "@/app/admin/page";

export default function AdminLayout({
    tab,
    setTab,
    loading,
    error,
    onGoStore,
    children,
}: {
    tab: AdminTab;
    setTab: (t: AdminTab) => void;
    loading: boolean;
    error: string;
    onGoStore: () => void;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <div className="w-full border-b border-gray-200 bg-white">
                <div className="px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5" />
                        <h1 className="text-xl font-bold">Panel de Administración</h1>
                    </div>

                    <button
                        onClick={onGoStore}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>

            <div className="px-8 py-6 flex gap-6">
                <AdminSidebar tab={tab} setTab={setTab} />

                <main className="flex-1">
                    {loading && <p className="text-gray-600">Cargando...</p>}

                    {!loading && error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && children}
                </main>
            </div>
        </div>
    );
}
