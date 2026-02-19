import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-600">Cargando checkout...</div>}>
            <CheckoutClient />
        </Suspense>
    );
}
