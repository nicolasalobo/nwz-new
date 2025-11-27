"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductCatalog from "@/components/sales/ProductCatalog";
import Cart from "@/components/sales/Cart";

export default function NewSalePage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [role, setRole] = useState<"admin" | "partner" | "affiliate">("admin");

    const addToCart = (product: any, variant: string) => {
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            productId: product.id,
            name: product.name,
            variant: variant,
            price: product.price
        };
        setCartItems([...cartItems, newItem]);
    };

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCheckout = (data: any) => {
        console.log("Checkout Data:", data);
        alert("Venda finalizada! (Ver console para dados)");
        setCartItems([]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col relative">

            {/* Role Switcher (Demo Only) */}
            <div className="fixed bottom-4 right-4 z-[60] flex bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full p-1 shadow-2xl">
                <button
                    onClick={() => setRole("admin")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "admin" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Admin
                </button>
                <button
                    onClick={() => setRole("partner")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "partner" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Parceiro
                </button>
                <button
                    onClick={() => setRole("affiliate")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "affiliate" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Afiliado
                </button>
            </div>

            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center px-6 sticky top-0 z-10">
                <Link href="/dashboard" className="mr-4 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-lg font-bold">Nova Venda <span className="text-zinc-500 text-sm font-normal ml-2">({role === "admin" ? "Admin" : role === "partner" ? "Parceiro" : "Afiliado"})</span></h1>
            </header>

            {/* Content Grid */}
            <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-64px)]">

                {/* Left: Catalog (7 cols) */}
                <div className="lg:col-span-7 h-full overflow-hidden">
                    <ProductCatalog onAddToCart={addToCart} />
                </div>

                {/* Right: Cart (5 cols) */}
                <div className="lg:col-span-5 h-full overflow-hidden">
                    <Cart
                        items={cartItems}
                        onRemove={removeFromCart}
                        onCheckout={handleCheckout}
                        role={role}
                    />
                </div>

            </main>
        </div>
    );
}
