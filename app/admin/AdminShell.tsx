"use client";

import { useEffect, type ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {

    const router = useRouter();
    const { user, loadingAuth } = useAuth();

    useEffect(() => {
        if (loadingAuth) return;

        if (!user || user.rol !== "Admin") {
            router.replace("/");
        }
    }, [loadingAuth, user, router]);

    if (loadingAuth) {
        return <div className="p-6 text-gray-600">Verificando sesión...</div>;
    }
    if (!user || user.rol !== "Admin") return null;

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <div className="w-full border-b border-gray-200 bg-white">
                <div className="px-8 py-4 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full items-center gap-3">
                            <LayoutDashboard className="w-5 h-5" />
                            <h1 id="admin-top" className="text-xl font-bold">Panel de Administración</h1>
                        </div>
                        <h3 className="flex items-center justify-center gap-1 text-sm text-gray-400">
                            Conectado como:
                            <p className="text-md text-gray-600 font-bold">{user.fullName}</p>
                        </h3>
                    </div>


                    <button
                        onClick={() => router.push("/")}
                        className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>

            <div className="px-8 py-6 flex gap-6">
                <AdminSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}