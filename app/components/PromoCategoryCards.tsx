"use client";

import { Category } from "@/lib/types/category";
import { useRouter } from "next/navigation";

type Promo = {
    category: Category;
    subtitle: string;
    title: string;
    imageUrl?: string;
};

type Props = {
    promos: Promo[];
};

export default function PromoCategoryCards({ promos }: Props) {

    const router = useRouter();

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {promos.map((p) => (
                    <div
                        key={p.category.id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                                <p className="text-[10px] sm:text-xs tracking-[0.35em] text-gray-500 font-semibold mb-2 sm:mb-3">
                                    {p.subtitle.toUpperCase()}
                                </p>

                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                                    {p.title}
                                </h3>

                                <button
                                    className="
                                        mt-4 sm:mt-6 w-fit bg-blue-600 text-white text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg 
                                        hover:bg-blue-700 transition hover:scale-102 cursor-pointer
                                    "
                                    onClick={() => router.push(`/products?categoryId=${p.category.id}`)}
                                >
                                    Ver más
                                </button>
                            </div>

                            <div
                                className={`
                                    md:w-[45%] md:min-w-[240px] bg-white flex items-center 
                                    justify-center p-4 sm:p-6 hover:scale-102 cursor-pointer
                                `}
                            >
                                {p.imageUrl ? (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.category.name}
                                        className="w-full h-[160px] sm:h-[200px] md:h-[220px] object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-sm text-center">
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}