"use client";

import { ListPlus, X } from "lucide-react";
import { Product } from "@/lib/types/product";
import { cartService } from "@/lib/api/cart";
import { useRouter } from "next/navigation";
import { useNotification } from "./NotificationProvider";

export default function ProductModal({
    product,
    onClose,
}: {
    product: Product | null;
    onClose: () => void;
}) {
    const router = useRouter();
    const { showNotification } = useNotification();

    if (!product) return null;

    const inStock = product.stock > 0;
    const stockText = inStock ? `${product.stock} disponibles` : "Sin stock";

    return (
        // Overlay
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]
                 md:flex md:items-center md:justify-center md:p-6"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="
                    w-full md:w-[900px] md:max-w-[92vw]
                    bg-white shadow-2xl border border-gray-200
                    rounded-t-2xl md:rounded-2xl overflow-hidden
                    max-h-[92vh] flex flex-col
                    mt-auto md:mt-0
                "
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div className="min-w-0">
                        <p className="text-xs tracking-[0.25em] text-gray-500 font-semibold">
                            DETALLE DEL PRODUCTO
                        </p>
                        <h2 className="text-base sm:text-lg font-semibold truncate">
                            {product.name}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label="Cerrar"
                        type="button"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
                    <div className="bg-gray-50">
                        <div className="w-full h-[260px] sm:h-[320px] md:h-full md:min-h-[420px] flex items-center justify-center p-4 sm:p-6">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">Sin imagen</span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1">

                                <span
                                    className={`
                                        inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold
                                        ${inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                    `}
                                >
                                    {stockText}
                                </span>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                                    U$S {product.price}
                                </p>

                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col min-h-0">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Detalles</p>

                            <div className="overflow-y-auto pr-2 min-h-0 max-h-[220px] sm:max-h-[260px]">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    disabled={!inStock}
                                    onClick={async () => {
                                        try {
                                            await cartService.add(product.id, 1);
                                            router.push("/cart");
                                        } catch (err: any) {
                                            router.push("/");
                                            console.error(err);
                                            alert("Error.");
                                        }
                                    }}
                                    className="
                                        h-12 w-full rounded-xl font-semibold text-sm bg-black text-white
                                        hover:bg-gray-900 transition
                                        active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                                    "
                                    type="button"
                                >
                                    {inStock ? "Comprar ahora" : "Sin stock"}
                                </button>

                                <button
                                    disabled={!inStock}
                                    onClick={async () => {
                                        try {
                                            await cartService.add(product.id, 1);
                                        } catch (err: any) {
                                            if (err.response?.status === 401) {
                                                router.push("/login");
                                                showNotification("Error, usuario no encontrado.", "error")
                                                return;
                                            }
                                            console.error(err);
                                            showNotification("Error, no se pudo añadir al carrito.", "error")
                                            return;
                                        }
                                        showNotification("Producto añadido al carrito.", "success")
                                    }}
                                    className="
                                        h-12 w-full rounded-xl font-semibold text-sm bg-blue-600 text-white
                                        hover:bg-blue-700 transition active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-2 cursor-pointer
                                    "
                                    type="button"
                                >
                                    <ListPlus className="w-5 h-5" />
                                    {inStock ? "Añadir al carrito" : "Sin stock"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}