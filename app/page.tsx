"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import FooterContact from "./components/FooterContact";
import ProductsCarouselRow from "./components/ProductsCarouselRow";
import PromoCategoryCards from "./components/PromoCategoryCards";

import { categoryService } from "@/lib/api/category";
import { productService } from "@/lib/api/products";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

import { useRouter } from "next/navigation";

import { pickRandom } from "@/utils";
import { Circle } from "lucide-react";

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const router = useRouter();

    const bannerUrl = "https://res.cloudinary.com/danl5ulmr/image/upload/v1770774381/vecteezy_online-shopping-on-phone-buy-sell-business-digital-web_4299835_fbzrml.jpg";

    useEffect(() => {
        categoryService.getAll().then(setCategories).catch(console.error);

        // Lo trae automaticamente ordenado por popularidad.
        productService.getAll("popular").then(setProducts).catch(console.error);
    }, []);

    // 4 Categorías random para carruseles.
    const featuredCategories = useMemo(() => pickRandom(categories, 4), [categories]);

    // 3 Categorías random para promos.
    const promoCategories = useMemo(() => pickRandom(categories, 3), [categories]);

    // Devuelve la lista de productos de esa categoría manteniendo el orden "popular".
    const productsForCategory = (categoryId: number) =>
        products.filter((p) => p.categoryId === categoryId);

    // Producto más popular por categoría = primer producto en la lista (porque global viene popular).
    const topProductImageForCategory = (categoryId: number) => {
        const first = products.find((p) => p.categoryId === categoryId);
        return first?.imageUrl ?? "";
    };

    const promos = useMemo(() => {
        const firstTwo = promoCategories.slice(0, 2);
        return firstTwo.map((c) => ({
            category: c,
            subtitle: c.name,
            title: `Encontrá productos en ${c.name}`,
            imageUrl: topProductImageForCategory(c.id), // Selecciona iamgen automaticamente (mas popular).
        }));
    }, [promoCategories, products]);

    return (
        <div id="top" className="min-h-screen text-black bg-gray-200">
            <Header />

            <section className="px-4 pt-4 mb-4">
                <div className="w-full flex justify-center">
                    {bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt="Banner"
                            className=" w-full max-w-6xl h-auto rounded-xl shadow-sm object-cover"
                        />
                    ) : (
                        <p className="text-gray-500 text-sm">Banner placeholder</p>
                    )}
                </div>
            </section>

            <Separador width="120px" />
            <section className="px-4 py-4">
                <div className="w-full max-w-6xl mx-auto">
                    {promos.length === 0 ? (
                        <p className="text-gray-500">Cargando promos...</p>
                    ) : (
                        <PromoCategoryCards promos={promos} />
                    )}
                </div>
            </section>

            <Separador width="230px" />

            <section className="px-4 py-6">
                <div className="w-full lg:max-w-[90%] mx-auto flex flex-col gap-8">
                    {featuredCategories.length === 0 ? (
                        <p className="text-gray-500">Cargando categorías...</p>
                    ) : (
                        <>
                            <ProductsCarouselRow
                                title={`¡No te podés perder estos productos en ${featuredCategories[0]?.name ?? ""}!`}
                                products={featuredCategories[0] ? productsForCategory(featuredCategories[0].id) : []}
                                categoryId={featuredCategories[0]?.id}
                                maxItems={9}
                            />

                            <ProductsCarouselRow
                                title={`¡Increíbles productos en ${featuredCategories[1]?.name ?? ""}!`}
                                products={featuredCategories[1] ? productsForCategory(featuredCategories[1].id) : []}
                                categoryId={featuredCategories[1]?.id}
                                maxItems={9}
                            />

                            <ProductsCarouselRow
                                title={`Más populares en ${featuredCategories[2]?.name ?? ""}`}
                                products={featuredCategories[2] ? productsForCategory(featuredCategories[2].id) : []}
                                categoryId={featuredCategories[2]?.id}
                                maxItems={9}
                            />

                            {/* PROMO */}
                            {promos.length > 0 ? <PromoCategoryCards promos={promos} /> : null}

                            <ProductsCarouselRow
                                title={`En relación a ${featuredCategories[3]?.name ?? ""}`}
                                products={featuredCategories[3] ? productsForCategory(featuredCategories[3].id) : []}
                                categoryId={featuredCategories[3]?.id}
                                maxItems={9}
                            />
                        </>
                    )}
                </div>
            </section>

            <Separador width="80px" />
            <div className="flex w-full bg-transparent items-center justify-center py-2">
                <button
                    onClick={() => router.push("/products")}
                    className="
                        flex bg-blue-600 text-white px-8 py-4 text-md font-semibold rounded-md shadow-xl
                        cursor-pointer hover:shadow-2xl hover:scale-102 transition-all duration-05s md:text-2xl
                    "
                >
                    Ver más productos
                </button>
            </div>
            <Separador width="160px" />

            <div id="contact" className="pt-4">
                <FooterContact />
            </div>
        </div>
    );
}

function Separador({ width }: { width: string }) {
    return (
        <div className="flex w-full items-center justify-center text-gray-300 gap-3">
            <div
                style={{ width }}
                className="h-[2px] bg-gray-300 rounded-xl"
            ></div>

            <Circle className="w-5 h-5" />

            <div
                style={{ width }}
                className="h-[2px] bg-gray-300 rounded-xl"
            ></div>
        </div>
    );
}