"use client";

import {
    LayoutDashboard,
    ShoppingCart,
    FileText,
    Menu,
    X,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import NewSaleButton from "@/components/ui/NewSaleButton";
import CopyCatalogButton from "@/components/ui/CopyCatalogButton";
import SalesHistoryButton from "@/components/ui/SalesHistoryButton";
import RecentSales from "@/components/dashboard/RecentSales";

export default function AffiliateDashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalSalesCount: 0,
        recentSales: []
    });

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setStats(data);
                }
            })
            .catch(err => console.error("Failed to fetch dashboard stats", err));
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white flex font-sans selection:bg-purple-500/30">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-72 bg-[#0B1121] border-r border-white/5 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        NWZ & CO.
                    </h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-zinc-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active />
                    <NavItem icon={<ShoppingCart size={20} />} label="Vendas" href="/sales/new" />
                    <NavItem icon={<FileText size={20} />} label="Histórico" href="/sales/my-history" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* My Balance Only */}
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Meu Saldo</span>
                            <span className="text-xl font-bold text-purple-400">
                                {stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm font-bold border-2 border-[#020617] ml-4">
                            A
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    <div className="max-w-5xl mx-auto space-y-8 flex flex-col items-center">

                        {/* Welcome */}
                        <div className="w-full">
                            <h2 className="text-3xl font-bold text-white mb-2">Olá, Afiliado 👋</h2>
                            <p className="text-zinc-400">Bem-vindo ao seu painel.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NewSaleButton className="w-full" />
                            <SalesHistoryButton className="w-full" href="/sales/my-history" />
                            <CopyCatalogButton className="w-full md:col-span-2" />
                        </div>

                        {/* Recent Sales */}
                        <RecentSales role="affiliate" sales={stats.recentSales} />

                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, href?: string }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }
            `}
        >
            <span className={`transition-colors ${active ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`}>
                {icon}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
