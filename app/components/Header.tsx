"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingCart,
    ChevronDown,
    ChevronUp,
    User,
    Package,
    LogOut,
    Store,
    Phone,
    Home,
} from "lucide-react";

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name);
    }, []);

    // Para que cierre si hace click afuera.
    // ===========================================
    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);
    // ==================================================================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUserName(null);
        setMenuOpen(false);
        router.push("/");
    };

    const scrollToId = (id: string) => {
        const elementoAIr = document.getElementById(id);
        if (!elementoAIr) return;
        elementoAIr.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
            <div className="w-full py-4 px-8 flex justify-between items-center">
                <button
                    onClick={() => scrollToId("top")}
                    className="text-2xl font-bold tracking-tight hover:opacity-80 cursor-pointer"
                >
                    ECommerce
                </button>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <button
                        onClick={() => scrollToId("top")}
                        className="flex items-center gap-2 hover:text-gray-600 cursor-pointer"
                    >
                        <Home className="w-4 h-4" /> Home
                    </button>
                    <button
                        onClick={() => scrollToId("products")}
                        className="flex items-center gap-2 hover:text-gray-600 cursor-pointer"
                    >
                        <Store className="w-4 h-4" /> Productos
                    </button>
                    <button
                        onClick={() => scrollToId("contact")}
                        className="flex items-center gap-2 hover:text-gray-600 cursor-pointer"
                    >
                        <Phone className="w-4 h-4" /> Contacto
                    </button>
                </nav>

                <div className="flex items-center gap-6">
                    {!userName ? (
                        <>
                            <div className="flex gap-2 text-sm">
                                <a href="/login" className="hover:text-gray-600 font-semibold">
                                    Iniciar sesión
                                </a>
                                <span>/</span>
                                <a href="/register" className="hover:text-gray-600 font-semibold">
                                    Registrarse
                                </a>
                            </div>
                            <a href="/cart" className="hover:opacity-70">
                                <ShoppingCart className="w-6 h-6" />
                            </a>
                        </>
                    ) : (
                        <>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />

                                    <span className="max-w-[140px] truncate">{userName}</span>
                                    {menuOpen ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>

                                <div
                                    className={`
                                        absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 w-52
                                        rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden
                                        origin-top transition-all duration-200 ease-out
                                        ${menuOpen
                                            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                        }
                                    `}
                                >
                                    <a
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            setMenuOpen(false)
                                            router.push("/profile")
                                        }}
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
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer text-red-600 font-semibold text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                </div>

                            </div>

                            <a href="/cart" className="hover:opacity-70">
                                <ShoppingCart className="w-6 h-6" />
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}