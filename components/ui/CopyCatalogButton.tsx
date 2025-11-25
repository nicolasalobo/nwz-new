"use client";

import { Copy, Check, X } from "lucide-react";
import { useState } from "react";

interface CopyCatalogButtonProps {
    className?: string;
}

const CATALOG_CONTENT = `NWZ Shop🔥

v50 R$ 80.00
• Mixed Berries
• Strawberry Kiwi
• Peach Mango Watermelon
• Green Apple
• Watermelon Mix
• Strawberry Watermelon

v155 R$ 110.00
• Tropical Açai
• Icy Mint`;

export default function CopyCatalogButton({ className = "" }: CopyCatalogButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopyAndOpen = async () => {
        try {
            await navigator.clipboard.writeText(CATALOG_CONTENT);
            setIsCopied(true);
            setIsModalOpen(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <button
                onClick={handleCopyAndOpen}
                className={`
          group relative flex items-center justify-center gap-3 px-8 py-4 
          bg-gradient-to-r from-pink-600 to-rose-500 
          rounded-2xl shadow-lg shadow-pink-500/20 
          hover:shadow-pink-500/40 hover:scale-[1.02] hover:-translate-y-0.5
          transition-all duration-300 ease-out
          ${className}
        `}
            >
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    {isCopied ? (
                        <Check className="text-white" size={24} strokeWidth={3} />
                    ) : (
                        <Copy className="text-white" size={24} strokeWidth={3} />
                    )}
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-lg leading-none">
                        {isCopied ? "Copiado!" : "Copiar Catálogo"}
                    </span>
                    <span className="text-pink-100 text-xs font-medium mt-1">
                        {isCopied ? "Link na área de transferência" : "Copiar para área de transferência"}
                    </span>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
                </div>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-[#0B1121] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">📋</span> Catálogo Copiado
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                                {CATALOG_CONTENT}
                            </div>
                            <p className="text-center text-xs text-zinc-500 mt-4">
                                O texto acima já está na sua área de transferência.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 bg-white/5">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                            >
                                Fechar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
