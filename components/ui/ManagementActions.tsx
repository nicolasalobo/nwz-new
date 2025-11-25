import { Users, Share2, Package, Briefcase } from "lucide-react";
import Link from "next/link";

interface ManagementActionsProps {
    className?: string;
}

export default function ManagementActions({ className = "" }: ManagementActionsProps) {
    return (
        <div className={`grid grid-cols-2 grid-rows-2 gap-1 w-full h-48 rounded-2xl overflow-hidden shadow-lg shadow-blue-900/10 bg-white/5 ${className}`}>

            {/* Stock (Top Left) */}
            <Link
                href="/management/stock"
                className="bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 flex flex-col items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <Package className="text-emerald-400 group-hover:text-emerald-300" size={20} />
                </div>
                <span className="text-white font-bold text-sm">Estoque</span>

                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </Link>

            {/* Affiliates (Top Right) */}
            <Link
                href="/management/affiliates"
                className="bg-gradient-to-bl from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 flex flex-col items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <Share2 className="text-purple-400 group-hover:text-purple-300" size={20} />
                </div>
                <span className="text-white font-bold text-sm">Afiliados</span>

                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </Link>

            {/* Partners (Bottom Left) */}
            <Link
                href="/management/partners"
                className="bg-gradient-to-tr from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 flex flex-col items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <Briefcase className="text-blue-400 group-hover:text-blue-300" size={20} />
                </div>
                <span className="text-white font-bold text-sm">Parceiros</span>

                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </Link>

            {/* Clients (Bottom Right) - Replaces Loyalty */}
            <Link
                href="/clients"
                className="bg-gradient-to-tl from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 flex flex-col items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden"
            >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                    <Users className="text-rose-400 group-hover:text-rose-300" size={20} />
                </div>
                <span className="text-white font-bold text-sm">Clientes</span>

                {/* Shine Effect */}
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
            </Link>

        </div>
    );
}
