"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Plus } from "lucide-react";

// Mock Data
const PRODUCTS = [
    {
        id: "p1",
        name: "Pod Descartável v50",
        price: 80.00,
        variants: [
            "Mixed Berries",
            "Strawberry Kiwi",
            "Peach Mango Watermelon",
            "Green Apple",
            "Watermelon Mix",
            "Strawberry Watermelon"
        ]
    },
    {
        id: "p2",
        name: "Pod Descartável v155",
        price: 110.00,
        variants: [
            "Tropical Açai",
            "Icy Mint",
            "Grape Ice",
            "Blueberry Ice"
        ]
    },
    {
        id: "p3",
        name: "Essência Love 66",
        price: 15.00,
        variants: [
            "Padrão"
        ]
    }
];

interface ProductCatalogProps {
    onAddToCart: (product: any, variant: string) => void;
}

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

    const filteredProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.variants.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleExpand = (id: string) => {
        setExpandedProduct(expandedProduct === id ? null : id);
    };

    return (
        <div className="bg-[#0B1121] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full">

            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Catálogo de Produtos</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all">

                        {/* Product Header */}
                        <button
                            onClick={() => toggleExpand(product.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                        >
                            <div>
                                <h3 className="font-bold text-white">{product.name}</h3>
                                <p className="text-sm text-emerald-400 font-medium">
                                    R$ {product.price.toFixed(2)}
                                </p>
                            </div>
                            {expandedProduct === product.id ? (
                                <ChevronUp className="text-zinc-400" size={20} />
                            ) : (
                                <ChevronDown className="text-zinc-400" size={20} />
                            )}
                        </button>

                        {/* Variants */}
                        {expandedProduct === product.id && (
                            <div className="border-t border-white/5 bg-black/20 p-2 space-y-1">
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onAddToCart(product, variant)}
                                        className="w-full p-3 rounded-lg flex items-center justify-between hover:bg-blue-600/20 group transition-colors"
                                    >
                                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                            {variant}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Plus size={16} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>

        </div>
    );
}
