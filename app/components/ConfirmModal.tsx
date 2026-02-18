"use client";

import { X } from "lucide-react";

type Props = {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    open,
    message,
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onCancel}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 z-10">
                <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">
                        Confirmación
                    </h2>

                    <button
                        onClick={onCancel}
                        className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-700">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}