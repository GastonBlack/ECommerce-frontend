"use client";

import { X, Home, Store, Phone, User, Package, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
    mobileRef: React.RefObject<HTMLDivElement | null>;
    goOrScrollTop: (path: string) => void;
    goContact: () => void;
    loadingAuth: boolean;
    userName: string | null;
    userRol: string | null;
    logout: () => Promise<void>;
};

export default function HeaderMobile({
    mobileOpen,
    setMobileOpen,
    mobileRef,
    goOrScrollTop,
    goContact,
    loadingAuth,
    userName,
    userRol,
    logout,
}: Props) {
    const router = useRouter();

    return (
        <div
            className={`
                md:hidden fixed inset-0 z-50
                ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}
            `}
        >
            <div
                className={`
                    absolute inset-0 bg-black/30 transition-opacity duration-200
                    ${mobileOpen ? "opacity-100" : "opacity-0"}
                `}
                onClick={() => setMobileOpen(false)}
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
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Cerrar"
                        className="cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 flex flex-col gap-2">
                    <button
                        onClick={() => {
                            goOrScrollTop("/");
                            setMobileOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                    >
                        <Home className="w-5 h-5" />
                        Home
                    </button>

                    <button
                        onClick={() => {
                            goOrScrollTop("/products");
                            setMobileOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                    >
                        <Store className="w-5 h-5" />
                        Productos
                    </button>

                    <button
                        onClick={() => {
                            goContact();
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                    >
                        <Phone className="w-5 h-5" />
                        Contacto
                    </button>

                    <div className="my-2 h-px bg-gray-200" />

                    {loadingAuth ? (
                        <div className="px-3 py-2 text-sm text-gray-400">
                            Cargando...
                        </div>
                    ) : !userName ? (
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
                                <p>Conectado como{" "}</p>
                                <span className="font-semibold">{userName}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    router.push("/profile");
                                }}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                            >
                                <User className="w-5 h-5" />
                                Mi perfil
                            </button>

                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    router.push("/profile/orders");
                                }}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                            >
                                <Package className="w-5 h-5" />
                                Mis pedidos
                            </button>

                            {userRol === "Admin" && (
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/admin");
                                    }}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left cursor-pointer"
                                >
                                    <Package className="w-5 h-5" />
                                    Panel de Administración
                                </button>
                            )}

                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left text-red-600 font-semibold cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}