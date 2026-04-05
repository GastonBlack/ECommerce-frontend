"use client";

import React from "react";
import { Boxes, Tags, ClipboardList, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function Button({
    active,
    onClick,
    icon,
    text,
    mobile = false,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    mobile?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                ${mobile ? "w-full justify-start" : "flex-1 justify-center"}
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition
                ${active ? "bg-black text-white" : "hover:bg-gray-50 text-gray-700"}
            `}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}

export default function AdminSidebar({
    mobile = false,
    onNavigate,
}: {
    mobile?: boolean;
    onNavigate?: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const inProducts = pathname === "/admin/products";
    const inCategories = pathname === "/admin/categories";
    const inOrders = pathname === "/admin/orders";
    const inUsers = pathname === "/admin/users";

    const goTo = (path: string) => {
        router.push(path);
        onNavigate?.();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {!mobile && (
                <p className="text-xs font-semibold text-gray-500 px-2 pb-2">SECCIONES</p>
            )}

            <div
                className={`
                    border border-gray-200 rounded-xl gap-2 bg-white
                    ${mobile ? "flex flex-col p-2 w-full" : "flex flex-row p-2"}
                `}
            >
                <Button
                    mobile={mobile}
                    active={inProducts}
                    onClick={() => goTo("/admin/products")}
                    icon={<Boxes className="w-4 h-4" />}
                    text="Productos"
                />

                <Button
                    mobile={mobile}
                    active={inCategories}
                    onClick={() => goTo("/admin/categories")}
                    icon={<Tags className="w-4 h-4" />}
                    text="Categorías"
                />

                <Button
                    mobile={mobile}
                    active={inOrders}
                    onClick={() => goTo("/admin/orders")}
                    icon={<ClipboardList className="w-4 h-4" />}
                    text="Pedidos"
                />

                <Button
                    mobile={mobile}
                    active={inUsers}
                    onClick={() => goTo("/admin/users")}
                    icon={<Users className="w-4 h-4" />}
                    text="Usuarios"
                />
            </div>
        </div>
    );
}