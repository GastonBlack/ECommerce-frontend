"use client";

import { Search } from "lucide-react";

interface Props {
    query: string;
    onQueryChange: (v: string) => void;
    onReload: () => void;
    loading: boolean;
    showDisabled: boolean;
    onShowDisabledChange: (v: boolean) => void;
}

export default function UsersToolbar({
    query,
    onQueryChange,
    showDisabled,
    onShowDisabledChange,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
                    />
                </div>

            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                    type="checkbox"
                    checked={showDisabled}
                    onChange={(e) => onShowDisabledChange(e.target.checked)}
                    className="h-4 w-4 accent-black"
                />
                Mostrar usuarios deshabilitados
            </label>
        </div>
    );
}