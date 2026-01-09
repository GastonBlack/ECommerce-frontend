"use client";

import { useEffect, useState } from "react";
import {
    ShoppingCart,
    ChevronDown,
    User,
    Package,
    LogOut,
} from "lucide-react";

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUserName(null);
        setMenuOpen(false);
        window.location.href = "/";
    };

    return (
        <header className="w-full py-5 px-8 flex justify-between items-center border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold tracking-tight">ECommerce</h1>

            <nav className="hidden md:flex gap-8 text-sm font-medium">
                <a href="#" className="hover:text-gray-600">Celulares</a>
                <a href="#" className="hover:text-gray-600">Graficas</a>
                <a href="#" className="hover:text-gray-600">Consolas</a>
                <a href="#" className="hover:text-gray-600">Auriculares</a>
            </nav>

            <div className="flex items-center gap-6">
                {/* NO LOGUEADO */}
                {!userName && (
                    <>
                        <div className="flex gap-2 text-sm">
                            <a href="/login" className="hover:text-gray-600 font-semibold">Iniciar sesión</a>
                            <span>/</span>
                            <a href="/register" className="hover:text-gray-600 font-semibold">Registrarse</a>
                        </div>

                        <a href="/cart" className="hover:text-gray-600">
                            <ShoppingCart className="w-6 h-6" />
                        </a>
                    </>
                )}

                {/* LOGUEADO */}
                {userName && (
                    <>
                        <div className="relative flex items-center">
                            {/* Botón nombre */}
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                                <span>{userName}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-1 top-5 z-50 w-48 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                                    <a
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Mi perfil
                                    </a>

                                    <a
                                        href="/orders"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Package className="w-4 h-4" />
                                        Mis pedidos
                                    </a>

                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer text-red-500 font-semibold"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Carrito a la derecha del nombre */}
                        <a href="/cart" className="hover:scale-105">
                            <ShoppingCart className="w-6 h-6" />
                        </a>
                    </>
                )}
            </div>
        </header>
    );
}
