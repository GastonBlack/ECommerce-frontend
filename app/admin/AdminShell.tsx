"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user, loadingAuth } = useAuth();
    const [sectionsOpen, setSectionsOpen] = useState(false);

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
        <div className="bg-gray-100 text-black min-h-screen">
            <div className="w-full border-b border-gray-200 bg-white">
                <div className="p-3 flex flex-col items-center justify-center bg-gray-100">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex w-full items-center justify-center gap-3">
                            <LayoutDashboard className="w-5 h-5" />
                            <h1 id="admin-top" className="text-lg md:text-xl font-bold text-center">
                                Panel de Administración
                            </h1>
                        </div>

                        <h3 className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-400 text-center">
                            Conectado como:
                            <span className="text-sm md:text-base text-gray-600 font-bold">
                                {user.fullName}
                            </span>
                        </h3>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="text-sm px-4 py-2 mt-3 rounded-lg border border-gray-200 bg-gray-100 shadow-md cursor-pointer hover:bg-gray-50 hover:shadow-xl transition"
                    >
                        Volver a la tienda
                    </button>

                    <div className="w-full mt-4 md:hidden">
                        <button
                            onClick={() => setSectionsOpen((prev) => !prev)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm cursor-pointer"
                        >
                            <span className="text-sm font-semibold text-gray-700">
                                Secciones
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${sectionsOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {sectionsOpen && (
                            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                                <AdminSidebar
                                    mobile
                                    onNavigate={() => setSectionsOpen(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-3 md:px-8 py-6 flex flex-col gap-6">
                <div className="hidden md:flex md:items-center md:justify-center">
                    <AdminSidebar />
                </div>

                <div className="w-full md:max-w-[70%] mx-auto">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}