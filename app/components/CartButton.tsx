"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { cartService } from "@/lib/api/cart";

export default function CartButton() {
    const router = useRouter();
    const { user, loadingAuth } = useAuth();

    const [hasCartItems, setHasCartItems] = useState(false);

    const loadCartState = async () => {
        if (loadingAuth) return;

        if (!user) {
            setHasCartItems(false);
            return;
        }

        try {
            const cart = await cartService.getCart();
            const items = Array.isArray(cart) ? cart : [];
            setHasCartItems(items.length > 0);
        } catch {
            setHasCartItems(false);
        }
    };

    useEffect(() => {
        loadCartState();

        window.addEventListener("cart-updated", loadCartState);
        return () => window.removeEventListener("cart-updated", loadCartState);
    }, [user, loadingAuth]);

    return (
        <button
            onClick={() => router.push("/cart")}
            className="relative hover:opacity-70 cursor-pointer"
            aria-label="Carrito"
        >
            <ShoppingCart className="w-6 h-6" />

            {hasCartItems && (
                <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-red-600 border-2 border-white shadow-sm" />
            )}
        </button>
    );
}