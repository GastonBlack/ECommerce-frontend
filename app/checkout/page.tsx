import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                            <div className="h-28 animate-pulse bg-gray-100" />
                            <div className="space-y-4 p-6 sm:p-8">
                                <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
                                <div className="h-4 w-72 animate-pulse rounded bg-gray-100" />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
                                    <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="h-12 w-full animate-pulse rounded-full bg-gray-100" />
                                    <div className="h-12 w-full animate-pulse rounded-full bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <CheckoutClient />
        </Suspense>
    );
}