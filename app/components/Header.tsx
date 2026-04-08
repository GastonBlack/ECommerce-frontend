"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
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
import { scrollToId } from "@/lib/utils/generalUtils";
import { useAuth } from "./AuthProvider";
import { authService } from "@/lib/api/auth";
import CartButton from "./CartButton";
import HeaderMobile from "./HeaderMobile";

export default function Header() {
    const { user, loadingAuth, refresh } = useAuth();

    const userName = user?.fullName ?? null;
    const userRol = user?.rol ?? null;

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const mobileRef = useRef<HTMLDivElement | null>(null);

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

    // Navegar o scrollear top según la ruta.
    const goOrScrollTop = (path: string) => {
        if (pathname === path) {
            scrollToId("top");
        } else {
            router.push(path);
        }
    };

    const goContact = () => {
        scrollToId("contact");
        setMobileOpen(false);
    };

    const logout = async () => {
        try {
            await authService.logout();
            window.dispatchEvent(new Event("cart-updated"));
        } finally {
            setMenuOpen(false);
            setMobileOpen(false);
            await refresh();
            router.push("/");
        }
    };

    return (
        <>
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
                            {loadingAuth ? (
                                <div className="text-sm text-gray-400">...</div>
                            ) : !userName ? (
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
                                                router.push("/profile/orders");
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

                        <CartButton />

                        <button
                            className="md:hidden hover:opacity-70 cursor-pointer"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </div>

            </header>

            <HeaderMobile
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                mobileRef={mobileRef}
                goOrScrollTop={goOrScrollTop}
                goContact={goContact}
                loadingAuth={loadingAuth}
                userName={userName}
                userRol={userRol}
                logout={logout}
            />
        </>
    );
}