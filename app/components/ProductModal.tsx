"use client";

import { ListPlus, X } from "lucide-react";
import { Product } from "@/lib/types/Product";
import { cartService } from "@/lib/api/cart";
import { useRouter } from "next/navigation";

export default function ProductModal({
    product,
    onClose,
}: {
    product: Product | null;
    onClose: () => void;
}) {
    if (!product) return null;
    const router = useRouter();

    const stockText = product.stock > 0 ? `${product.stock} disponibles` : "Sin stock";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay */}
            <button
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
                aria-label="Cerrar modal"
            />

            {/* Panel */}
            <div className="relative z-10 w-[65%] h-[70vh] rounded-md bg-white shadow-2xl overflow-hidden">

                {/* Container */}
                <div className="w-full h-full flex flex-row p-4">

                    {/* Image */}
                    <div className="w-[40%] flex justify-center items-center">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">Sin imagen</span>
                        )}
                    </div>

                    {/* Product information */}
                    <div className="w-[60%] flex flex-col px-4">

                        {/* Close panel */}
                        <div className="w-full flex justify-end pr-4 pt-4">
                            <X className="w-8 h-8 cursor-pointer" onClick={onClose} />
                        </div>

                        <div className="flex-1 w-full flex flex-col items-left gap-4">
                            <span className="font-semibold text-3xl">{product.name}</span>
                            <span className="font-semibold ">-{stockText}-</span>
                            <span className="font-bold text-2xl">U$S {product.price}</span>
                            <span className="bg-gray-200 p-2 rounded-xs">{product.description}</span>
                        </div>

                        {/* Buttons section */}
                        <div className="w-full p-4 flex justify-center items-center gap-4">
                            <button
                                disabled={product.stock <= 0}
                                onClick={() => {
                                    { "Aca tiene que hacer un push a la pagina de compra directamente sin pasar al carrito, falta implementar." }
                                }}
                                className="
                                    w-32 h-12 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-900 cursor-pointer
                                    active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-103"
                            >
                                {product.stock > 0 ? "Comprar ahora" : "Sin stock"}
                            </button>
                            <button
                                disabled={product.stock <= 0}
                                onClick={async () => {
                                    try {
                                        await cartService.add(product.id, 1); // Por ahora solo puede agregar uno a la vez, falta implementar cantidades.\
                                        onClose(); // Cierra el panel despues de agregar el producto al carrito.
                                    } catch (err: any) {
                                        // SI no esta logueado el backend devuelve 401, ya que necesita estar logueado para poder comprar o agregar productos.
                                        if (err.response?.status === 401) {
                                            router.push("/login");
                                            return;
                                        }
                                        console.error(err);
                                        alert("Error al agregar al carrito"); // FALTA TESTING, HAY QUE SOLUCIONAR UN ERROR QUE AGREGA EL PRODUCTO PERO IGUAL MANDA ERR 500.
                                    }
                                    alert(`Producto agregado: ${product.name}`);
                                }}
                                className="
                                    h-12 flex justify-center items-center bg-blue-400 text-white rounded-xl font-semibold text-sm px-2 
                                    cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-103"
                            >
                                <ListPlus className="w-8" /> {product.stock > 0 ? "Añadir al carrito" : "Sin stock"}
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}