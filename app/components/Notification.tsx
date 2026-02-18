"use client";

import { CheckCircle, XCircle } from "lucide-react";

type Props = {
    message: string;
    type: "success" | "error";
};

export default function Notification({ message, type }: Props) {
    const isSuccess = type === "success";

    return (
        <div
            className={`
                flex items-center gap-3 px-5 py-4 rounded-sm shadow-xl text-white font-semibold animate-slide-in
                ${isSuccess
                    ? "bg-green-600"
                    : "bg-red-600"}
            `}
        >
            {isSuccess ? (
                <CheckCircle className="w-5 h-5" />
            ) : (
                <XCircle className="w-5 h-5" />
            )}

            <span>{message}</span>
            
        </div>
    );
}