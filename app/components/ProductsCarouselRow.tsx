"use client";

import { useMemo, useRef, useState } from "react";
import { Product } from "@/lib/types/product";
import ProductModal from "./ProductModal";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    title: string;
    products: Product[];
    maxItems?: number;
    categoryId?: number;
};

export default function ProductsCarouselRow({
    title,
    products,
    maxItems = 12,
    categoryId,
}: Props) {
    const [selected, setSelected] = useState<Product | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const list = useMemo(() => products.slice(0, maxItems), [products, maxItems]);

    const scrollByCards = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;

        const amount = Math.floor(el.clientWidth * 0.85);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 pt-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-semibold">{title}</h2>

                    {categoryId ? (
                        <Link
                            href={`/products?categoryId=${categoryId}&sort=popular`}
                            className="text-sm font-semibold  w-fit bg-blue-500 text-white px-2 py-1 rounded-md hover:scale-102 hover:shadow-xl transition-all"
                        >
                            Ir a categoría
                        </Link>
                    ) : null}
                </div>
            </div>

            <div className="px-2 sm:px-4 pb-6">
                <div className="flex items-center gap-2 sm:gap-3">

                    <button
                        onClick={() => scrollByCards("left")}
                        className="
                            hidden md:flex flex-shrink-0 items-center justify-center w-11 h-11
                            rounded-full bg-white border border-gray-200 shadow
                            hover:shadow-md cursor-pointer
                        "
                        aria-label="Scroll left"
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div
                        ref={scrollerRef}
                        className="w-full md:flex-1 flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-2"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {list.map((p) => (
                            <div
                                key={p.id}
                                className="
                                    min-w-[170px] max-w-[170px]
                                    sm:min-w-[210px] sm:max-w-[210px]
                                    md:min-w-[260px] md:max-w-[260px]
                                    bg-white rounded-lg border border-gray-200 shadow-md
                                    hover:shadow-2xl transition cursor-pointer hover:scale-102 
                                "
                                onClick={() => setSelected(p)}
                            >
                                <div
                                    className="
                                        w-full h-[140px] sm:h-[160px] md:h-[170px] bg-gray-50 flex items-center justify-center 
                                        overflow-hidden rounded-t-lg
                                    ">
                                    {p.imageUrl ? (
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            className="w-full h-full object-contain p-4 sm:p-2"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">Sin imagen</span>
                                    )}
                                </div>

                                <div className="w-full px-4 flex flex-col flex-1">
                                    <p className="mt-3 text-md font-medium line-clamp-2 min-h-[44px]">
                                        {p.name}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 line-clamp-2 min-h-[36px]">
                                        {p.description}
                                    </p>
                                    <p className="mt-auto text-black font-medium text-lg mb-3">
                                        U$S {p.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollByCards("right")}
                        className="
                            hidden md:flex flex-shrink-0 items-center justify-center
                            w-11 h-11 rounded-full bg-white border border-gray-200 shadow
                            hover:shadow-md cursor-pointer
                        "
                        aria-label="Scroll right"
                        type="button"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                </div>
                <ProductModal product={selected} onClose={() => setSelected(null)} />
            </div>
        </section>
    );
}