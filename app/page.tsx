"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductsRender from "./components/ProductsRender";
import FooterContact from "./components/FooterContact";

export default function HomePage() {
    return (
        <div className="min-h-screen text-black bg-gray-200">

            <Header/>

            {/* Seccion con imagen de fondo, falta implementar */}
            <section></section>

            <ProductsRender/>
            <FooterContact/>
        </div>
    );
}
