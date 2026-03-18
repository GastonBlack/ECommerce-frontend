// app/admin/AdminSidebar.tsx
"use client";

import React from "react";
import { Boxes, Tags, ClipboardList, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function Button({
    active,
    onClick,
    icon,
    text,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer
        ${active ? "bg-black text-white" : "hover:bg-gray-50 text-gray-700"}
      `}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}

export default function AdminSidebar() {

    const router = useRouter();
    const pathname = usePathname();

    const inProducts = pathname === "/admin/products";
    const inCategories = pathname === "/admin/categories";
    const inOrders = pathname === "/admin/orders";
    const inUsers = pathname === "/admin/users";

    return (
        <aside className="w-72 bg-white rounded-xl border border-gray-200 shadow-sm p-3 h-fit sticky top-24">
            <p className="text-xs font-semibold text-gray-500 px-2 pb-2">SECCIONES</p>

            <Button
                active={inProducts}
                onClick={() => router.push("/admin/products")}
                icon={<Boxes className="w-4 h-4" />}
                text="Productos"
            />

            <Button
                active={inCategories}
                onClick={() => router.push("/admin/categories")}
                icon={<Tags className="w-4 h-4" />}
                text="Categorías"
            />

            <Button
                active={inOrders}
                onClick={() => router.push("/admin/orders")}
                icon={<ClipboardList className="w-4 h-4" />}
                text="Pedidos"
            />

            <Button
                active={inUsers}
                onClick={() => router.push("/admin/users")}
                icon={<Users className="w-4 h-4" />}
                text="Usuarios"
            />
        </aside>
    );
}