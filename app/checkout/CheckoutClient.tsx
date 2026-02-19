"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentsService } from "@/lib/api/payment";

type MPStatus = "success" | "pending" | "failure";

export default function CheckoutClient() {

    const sp = useSearchParams();
    const router = useRouter();

    // MercadoPago manda status por back_urls:
    // /checkout?status=success | pending | failure
    const status = (sp.get("status") as MPStatus) || "pending";
    const orderId = Number(sp.get("orderId") || localStorage.getItem("lastOrderId") || 0);

    const [orderStatus, setOrderStatus] = useState<string>(
        orderId ? "Verificando..." : "Sin orderId"
    );

    // Polling solo si tiene sentido (success/pending y hay orderId)
    const shouldPoll = useMemo(() => {
        return orderId > 0 && (status === "success" || status === "pending");
    }, [orderId, status]);

    useEffect(() => {
        if (!shouldPoll) return;

        let alive = true;
        let timer: any = null;

        const tick = async () => {
            try {
                const r = await paymentsService.getOrderStatus(orderId);
                if (!alive) return;

                setOrderStatus(r.status);

                // Corta cuando ya terminó.
                if (r.status === "Paid" || r.status === "Cancelled") return;

                timer = setTimeout(tick, 2000);
            } catch {
                if (!alive) return;
                setOrderStatus("No se pudo verificar la orden.");
                timer = setTimeout(tick, 3000);
            }
        };

        tick();

        return () => {
            alive = false;
            if (timer) clearTimeout(timer);
        };
    }, [shouldPoll, orderId]);

    // UI según status.
    if (status === "failure") {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">Pago fallido</h1>
                <p className="mt-2 text-gray-600">
                    No se pudo completar el pago. Probá de nuevo.
                </p>

                {orderId ? <p className="mt-4">Orden #{orderId}</p> : null}

                <button
                    onClick={() => router.push("/cart")}
                    className="mt-6 px-6 py-3 rounded-full bg-black text-white font-semibold"
                >
                    Volver al carrito
                </button>
            </div>
        );
    }

    // Pending o success (success puede tardar igual, por webhook).
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">
                {status === "success" ? "Pago exitoso" : "Pago pendiente"}
            </h1>

            {orderId ? (
                <>
                    <p className="mt-4">Orden #{orderId}</p>
                    <p className="mt-2">Estado: {orderStatus}</p>
                </>
            ) : (
                <p className="mt-4 text-red-600">
                    No llegó el orderId en la URL. (Tenés que pasarlo vos)
                </p>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    onClick={() => router.push("/orders")}
                    className="px-6 py-3 rounded-full bg-black text-white font-semibold"
                >
                    Ver mis pedidos
                </button>

                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 rounded-full border border-gray-300 font-semibold"
                >
                    Ir al inicio
                </button>
            </div>
        </div>
    );
}