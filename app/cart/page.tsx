"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { cartService } from "@/lib/api/cart";
import { CartItem } from "@/lib/types/cartItem";
import { useAuth } from "../components/AuthProvider";

export default function CartPage() {
    const router = useRouter();
    const { user, loadingAuth, refresh } = useAuth();

    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [error, setError] = useState("");

    const subtotal = useMemo(() => {
        return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    }, [items]);

    const loadCart = async () => {
        setError("");
        setLoading(true);
        try {
            const data = await cartService.getCart();
            setItems(data);
        } catch (err: any) {
            if (err.response?.status === 401) {
                await refresh(); // Para re-sincronizar auth.
                router.replace("/login?expired=true");
                return;
            }
            setError("No se pudo cargar el carrito.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loadingAuth) return;
        if (!user) {
            router.replace("/login?needUser=true");
            return;
        }

        loadCart();
    }, [loadingAuth, user]);

    const updateQty = async (cartItemId: number, newQty: number) => {
        if (newQty < 1) return;

        setBusyId(cartItemId);
        try {
            await cartService.update(cartItemId, newQty);
            setItems((prev) =>
                prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
            );
        } catch (err: any) {
            if (err.response?.status === 401) {
                await refresh();
                router.replace("/login?expired=true");
                return;
            }
            setError("No se pudo actualizar la cantidad.");
        } finally {
            setBusyId(null);
        }
    };

    const removeItem = async (cartItemId: number) => {
        setBusyId(cartItemId);
        try {
            await cartService.remove(cartItemId);
            setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
        } catch (err: any) {
            if (err.response?.status === 401) {
                await refresh();
                router.replace("/login?expired=true");
                return;
            }
            setError("No se pudo eliminar el producto del carrito.");
        } finally {
            setBusyId(null);
        }
    };

    const clearCart = async () => {
        setBusyId(-1);
        try {
            await cartService.clear();
            setItems([]);
        } catch (err: any) {
            if (err.response?.status === 401) {
                await refresh();
                router.replace("/login?expired=true");
                return;
            }
            setError("No se pudo vaciar el carrito.");
        } finally {
            setBusyId(null);
        }
    };

    if (loadingAuth) {
        return <div className="p-6 text-gray-600">Verificando sesión...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-black">
            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Volver</span>
                    </button>

                    <h1 className="text-2xl font-bold">Carrito</h1>

                    <div className="w-[72px]" />
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Cargando carrito...</p>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 p-10 text-center">
                        <p className="text-gray-700 font-medium mb-2">Tu carrito está vacío</p>
                        <p className="text-sm text-gray-500 mb-6">
                            Agregá productos para verlos acá.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 h-12 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition cursor-pointer"
                        >
                            Ir a la tienda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                        <div className="space-y-4">
                            {items.map((i) => (
                                <div
                                    key={i.cartItemId}
                                    className="flex gap-4 rounded-2xl border border-gray-200 p-4 bg-white"
                                >
                                    <div className="w-28 h-28 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center">
                                        {i.imageUrl ? (
                                            <Image
                                                src={i.imageUrl}
                                                alt={i.productName}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-contain p-2"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sin imagen</span>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold">{i.productName}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    U$S {i.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => removeItem(i.cartItemId)}
                                                disabled={busyId === i.cartItemId}
                                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQty(i.cartItemId, i.quantity - 1)}
                                                    disabled={busyId === i.cartItemId || i.quantity <= 1}
                                                    className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Minus className="w-4 h-4 mx-auto" />
                                                </button>

                                                <div className="w-12 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-semibold">
                                                    {i.quantity}
                                                </div>

                                                <button
                                                    onClick={() => updateQty(i.cartItemId, i.quantity + 1)}
                                                    disabled={busyId === i.cartItemId}
                                                    className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4 mx-auto" />
                                                </button>
                                            </div>

                                            <p className="font-semibold">
                                                U$S {(i.price * i.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                disabled={busyId === -1}
                                className="text-sm text-gray-600 hover:text-black underline disabled:opacity-50 cursor-pointer"
                            >
                                Vaciar carrito
                            </button>
                        </div>

                        <div className="rounded-2xl border border-gray-200 p-6 h-fit bg-white">
                            <h2 className="text-lg font-semibold mb-4">Resumen</h2>

                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Subtotal</span>
                                <span>U$S {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                                <span>Envío</span>
                                <span>A calcular</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>U$S {subtotal.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => alert("Checkout (pendiente)")}
                                className="mt-6 w-full h-12 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition cursor-pointer"
                            >
                                Ir a pagar
                            </button>

                            <p className="text-xs text-gray-500 mt-3">
                                {/* TODO: Conectar checkout con endpoint de orders */}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
