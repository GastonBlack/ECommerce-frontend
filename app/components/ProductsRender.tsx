"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/api/products";

export default function ProductsRender() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        productService.getAll().then(setProducts).catch(console.error);
    }, []);
    
    return (
        <section className="w-full px-8 mt-4 pb-4">
            {products.length === 0 ? (
                <p className="text-gray-500">Cargando productos...</p>
            ) : (
                <div
                    className="grid gap-10 gap-y-5 bg-gray-200"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
                    }}
                >
                    {products.map((p: any) => (

                        <div key={p.id}
                            className="flex flex-col cursor-pointer w-70 bg-white shadow-sm rounded-md items-center
                            hover:shadow-md hover:shadow-2xl hover:scale-101 transition"
                        >

                            {/* Imagen */}
                            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                                {p.imageUrl ? (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-6"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">Sin imagen</span>
                                )}
                            </div>

                            <div className="w-[60%] h-[1px] bg-black opacity-30"></div>

                            <div className="w-full px-4">
                                <p className="mt-3 text-md font-small">{p.name}</p>

                                <p className="text-black font-medium text-lg mb-3">U$S{p.price}</p>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
