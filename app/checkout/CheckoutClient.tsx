"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, CircleX, Home, Receipt, ShoppingCart } from "lucide-react";
import { paymentsService } from "@/lib/api/payment";
import { getOrderStatusUI, normalizeOrderStatus } from "@/lib/utils/orderStatus";

type MPStatus = "success" | "pending" | "failure";

function getCheckoutVisual(status: MPStatus, orderStatus?: string) {
    const normalized = normalizeOrderStatus(orderStatus);

    if (status === "failure" || normalized === "Cancelled") {
        return {
            title: "Pago fallido",
            subtitle: "No se pudo completar el pago. Revisá el estado de la compra o intentá nuevamente.",
            banner: "from-red-500 via-red-400 to-red-300",
            soft: "bg-red-50 border-red-200",
            iconWrap: "bg-white/20",
            icon: <CircleX className="h-8 w-8 text-white" />,
        };
    }

    if (status === "success" || normalized === "Paid") {
        return {
            title: "Pago exitoso",
            subtitle: "Tu compra fue registrada correctamente. Ya podés seguir el estado del pedido.",
            banner: "from-emerald-600 via-emerald-500 to-green-400",
            soft: "bg-emerald-50 border-emerald-200",
            iconWrap: "bg-white/20",
            icon: <CheckCircle2 className="h-8 w-8 text-white" />,
        };
    }

    return {
        title: "Pago pendiente",
        subtitle: "Estamos esperando la confirmación del pago. Esto puede tardar unos instantes.",
        banner: "from-amber-500 via-orange-400 to-yellow-300",
        soft: "bg-orange-50 border-orange-200",
        iconWrap: "bg-white/20",
        icon: <Clock3 className="h-8 w-8 text-white" />,
    };
}

export default function CheckoutClient() {
    const sp = useSearchParams();
    const router = useRouter();

    const status = (sp.get("status") as MPStatus) || "pending";
    const orderId = Number(sp.get("orderId") || localStorage.getItem("lastOrderId") || 0);

    const [orderStatus, setOrderStatus] = useState<string>(
        orderId ? "Verificando..." : "Sin orderId"
    );

    const shouldPoll = useMemo(() => {
        return orderId > 0 && (status === "success" || status === "pending");
    }, [orderId, status]);

    useEffect(() => {
        if (!shouldPoll) return;

        let alive = true;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const tick = async () => {
            try {
                const r = await paymentsService.getOrderStatus(orderId);
                if (!alive) return;

                setOrderStatus(r.status);

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

    const statusUi =
        orderStatus === "Verificando..." || orderStatus === "Sin orderId" || orderStatus === "No se pudo verificar la orden."
            ? null
            : getOrderStatusUI(orderStatus);

    const visual = getCheckoutVisual(status, orderStatus);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className={`relative overflow-hidden bg-gradient-to-r ${visual.banner}`}>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                            <div className="absolute left-10 top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                            <div className="absolute bottom-0 right-1/3 h-20 w-20 rounded-full bg-white/10 blur-lg" />
                        </div>

                        <div className="relative flex flex-col gap-5 p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${visual.iconWrap} backdrop-blur-sm`}>
                                    {visual.icon}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-white/85">
                                        Checkout
                                    </p>
                                    <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                                        {visual.title}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
                                        {visual.subtitle}
                                    </p>
                                </div>
                            </div>

                            {statusUi && (
                                <div className="self-start md:self-auto">
                                    <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                                        {statusUi.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-5 sm:p-8">
                        {status === "failure" ? (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
                                    <p className="text-sm font-medium text-red-700">
                                        No se pudo completar el pago.
                                    </p>
                                    <p className="mt-1 text-sm text-red-600">
                                        Probá nuevamente desde el carrito o revisá el método de pago elegido.
                                    </p>

                                    {orderId ? (
                                        <p className="mt-3 text-sm text-red-700">
                                            Orden asociada: <span className="font-semibold">#{orderId}</span>
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => router.push("/cart")}
                                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 font-semibold text-white transition hover:bg-gray-900 sm:w-auto cursor-pointer hover:scale-103 hover:shadow-xl"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Volver al carrito
                                    </button>

                                    <button
                                        onClick={() => router.push("/")}
                                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 font-semibold text-gray-800 transition hover:bg-gray-50 sm:w-auto cursor-pointer hover:scale-103 hover:shadow-xl"
                                    >
                                        <Home className="h-4 w-4" />
                                        Ir al inicio
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className={`rounded-2xl border p-5 ${visual.soft}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                                                <Receipt className="h-5 w-5 text-gray-700" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Orden
                                                </p>
                                                <p className="text-xl font-bold text-gray-900">
                                                    {orderId ? `#${orderId}` : "Sin orderId"}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm text-gray-600">
                                            Este número identifica tu compra y te sirve para seguir el estado del pedido.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                                                <Clock3 className="h-5 w-5 text-gray-700" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Estado actual
                                                </p>

                                                {statusUi ? (
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${statusUi.badge}`}>
                                                            {statusUi.label}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {orderStatus}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm text-gray-600">
                                            {orderStatus === "Verificando..."
                                                ? "Estamos consultando el estado más reciente del pago."
                                                : orderStatus === "No se pudo verificar la orden."
                                                    ? "Hubo un problema al consultar la orden. Podés revisar tus pedidos para confirmarlo."
                                                    : "El estado del pedido se actualiza automáticamente según la confirmación del pago."}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                        ¿Qué querés hacer ahora?
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Podés revisar tu historial de compras o volver al inicio para seguir navegando.
                                    </p>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            onClick={() => router.push("/profile/orders")}
                                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 font-semibold text-white transition hover:bg-gray-900 sm:w-auto cursor-pointer hover:scale-103 hover:shadow-xl"
                                        >
                                            <Receipt className="h-4 w-4" />
                                            Ver mis pedidos
                                        </button>

                                        <button
                                            onClick={() => router.push("/")}
                                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 font-semibold text-gray-800 transition hover:bg-gray-50 sm:w-auto cursor-pointer hover:scale-103 hover:shadow-xl"
                                        >
                                            <Home className="h-4 w-4" />
                                            Ir al inicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}