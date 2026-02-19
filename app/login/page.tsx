import { Suspense } from "react";
import LoginClient from "./LoginPageClient";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="p-6 text-gray-600">Cargando...</div>}>
            <LoginClient />
        </Suspense>
    );
}