import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface PurchasesButtonProps {
    className?: string;
}

export default function PurchasesButton({ className = "" }: PurchasesButtonProps) {
    return (
        <Link
            href="/purchases"
            className={`
        group relative flex items-center justify-center gap-3 px-8 py-4 
        bg-gradient-to-r from-amber-500 to-orange-600 
        rounded-2xl shadow-lg shadow-orange-500/20 
        hover:shadow-orange-500/40 hover:scale-[1.02] hover:-translate-y-0.5
        transition-all duration-300 ease-out
        ${className}
      `}
        >
            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <ShoppingBag className="text-white" size={24} strokeWidth={3} />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-white font-bold text-lg leading-none">Compras</span>
                <span className="text-orange-100 text-xs font-medium mt-1">Suprimentos da loja</span>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </div>
        </Link>
    );
}
