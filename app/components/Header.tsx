"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    Menu,
    X,
} from "lucide-react";
import { getUserFromToken } from "@/lib/helpers/jwt/getUserFromToken";
import { scrollToId } from "@/utils";

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userRol, setUserRol] = useState<string | null>("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const mobileRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name);

        const user = getUserFromToken();
        setUserRol(user?.rol ?? null);
    }, []);

    // Cierra dropdown desktop si hace click afuera.
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

    // Cierra drawer mobile si hace click afuera.
    useEffect(() => {
        if (!mobileOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (mobileRef.current && !mobileRef.current.contains(target)) {
                setMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileOpen]);

    // Navegar o scrollear top según la ruta
    const goOrScrollTop = (path: string) => {
        if (pathname === path) {
            scrollToId("top");
        } else {
            router.push(path);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUserName(null);
        setMenuOpen(false);
        setMobileOpen(false);
        router.push("/");
    };

    const goContact = () => {
        // Si el usuario está en "/" o "/products" y el footer existe, scrollea.
        scrollToId("contact");
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
            <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <button
                    onClick={() => goOrScrollTop("/")}
                    className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-80 cursor-pointer"
                >
                    ECommerce
                </button>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <button
                        onClick={() => goOrScrollTop("/")}
                        className="flex items-center gap-2 hover:text-gray-600 cursor-pointer"
                    >
                        <Home className="w-4 h-4" /> Home
                    </button>

                    <button
                        onClick={() => goOrScrollTop("/products")}
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

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden md:block">
                        {!userName ? (
                            <div className="flex gap-2 text-sm">
                                <button
                                    onClick={() => router.push("/login")}
                                    className="hover:text-gray-600 font-semibold cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                                <span>/</span>
                                <button
                                    onClick={() => router.push("/register")}
                                    className="hover:text-gray-600 font-semibold cursor-pointer"
                                >
                                    Registrarse
                                </button>
                            </div>
                        ) : (
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
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 text-left cursor-pointer"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push("/profile");
                                        }}
                                    >
                                        <User className="w-4 h-4" />
                                        Mi perfil
                                    </button>

                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 text-left cursor-pointer"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push("/orders");
                                        }}
                                    >
                                        <Package className="w-4 h-4" />
                                        Mis pedidos
                                    </button>

                                    {userRol === "Admin" && (
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 text-left cursor-pointer"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                router.push("/admin");
                                            }}
                                        >
                                            <Package className="w-4 h-4" />
                                            Panel de Administración
                                        </button>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer text-red-600 font-semibold text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push("/cart")}
                        className="hover:opacity-70 cursor-pointer"
                        aria-label="Carrito"
                    >
                        <ShoppingCart className="w-6 h-6" />
                    </button>

                    <button
                        className="md:hidden hover:opacity-70 cursor-pointer"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <Menu className="w-7 h-7" />
                    </button>
                </div>
            </div>

            <div
                className={`
                    md:hidden fixed inset-0 z-50
                    ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}
                `}
            >
                <div
                    className={`
                        absolute inset-0 bg-black/30 transition-opacity
                        ${mobileOpen ? "opacity-100" : "opacity-0"}
                    `}
                />

                <div
                    ref={mobileRef}
                    className={`
                        absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl
                        transition-transform duration-200
                        ${mobileOpen ? "translate-x-0" : "translate-x-full"}
                    `}
                >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="font-semibold">Menú</div>
                        <button onClick={() => setMobileOpen(false)} aria-label="Cerrar">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                        <button
                            onClick={() => {
                                goOrScrollTop("/");
                                setMobileOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                        >
                            <Home className="w-5 h-5" /> Home
                        </button>

                        <button
                            onClick={() => {
                                goOrScrollTop("/products");
                                setMobileOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                        >
                            <Store className="w-5 h-5" /> Productos
                        </button>

                        <button
                            onClick={goContact}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                        >
                            <Phone className="w-5 h-5" /> Contacto
                        </button>

                        <div className="my-2 h-px bg-gray-200" />

                        {!userName ? (
                            <>
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/login");
                                    }}
                                    className="px-3 py-3 rounded-lg hover:bg-gray-100 text-left font-semibold cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/register");
                                    }}
                                    className="px-3 py-3 rounded-lg hover:bg-gray-100 text-left font-semibold cursor-pointer"
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="px-3 py-2 text-sm text-gray-600">
                                    Conectado como <span className="font-semibold">{userName}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/profile");
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                                >
                                    <User className="w-5 h-5" /> Mi perfil
                                </button>

                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/orders");
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                                >
                                    <Package className="w-5 h-5" /> Mis pedidos
                                </button>

                                {userRol === "Admin" && (
                                    <button
                                        onClick={() => {
                                            setMobileOpen(false);
                                            router.push("/admin");
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                                    >
                                        <Package className="w-5 h-5" /> Panel de Administración
                                    </button>
                                )}

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left text-red-600 font-semibold"
                                >
                                    <LogOut className="w-5 h-5" /> Cerrar sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}