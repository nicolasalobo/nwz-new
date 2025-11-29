"use client";

import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NewSaleButton from "@/components/ui/NewSaleButton";
import SalesHistoryButton from "@/components/ui/SalesHistoryButton";
import ManagementActions from "@/components/ui/ManagementActions";
import PurchasesButton from "@/components/ui/PurchasesButton";
import CopyCatalogButton from "@/components/ui/CopyCatalogButton";
import RecentSales from "@/components/dashboard/RecentSales";

export default function AdminDashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#020617] text-white overflow-hidden selection:bg-blue-500 selection:text-white">

            {/* Background Ambience (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#020617]/90 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

                {/* Logo Area */}
                <div className="h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] flex items-center justify-between px-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <span className="font-bold text-white">N</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">NWZ Shop</span>
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-zinc-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Principal</div>

                    <NavItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active />
                    <NavItem icon={<ShoppingCart size={20} />} label="Vendas" href="/sales/new" />
                    <NavItem icon={<Package size={20} />} label="Estoque" href="/management/stock" />
                    <NavItem icon={<Users size={20} />} label="Clientes" href="/clients" />

                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2 mt-6">Gestão</div>

                    <NavItem icon={<Users size={20} />} label="Usuários" href="/admin/users" />
                    <NavItem icon={<Users size={20} />} label="Parceiros" href="/management/partners" />
                    <NavItem icon={<Users size={20} />} label="Afiliados" href="/management/affiliates" />
                    <NavItem icon={<BarChart3 size={20} />} label="Relatórios" href="/reports" />
                    <NavItem icon={<FileText size={20} />} label="Histórico" href="/sales/history" />
                    <NavItem icon={<Settings size={20} />} label="Configurações" href="/settings" />

                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
                        <LogOut size={20} />
                        <span className="font-medium">Sair do Sistema</span>
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col z-10 overflow-hidden">

                {/* Top Header */}
                <header className="h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-6">

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>


                    {/* Balance Display */}
                    <div className="flex flex-col items-end mr-4 md:mr-6 ml-auto">
                        <span className="text-[10px] md:text-xs text-zinc-400 font-medium">Saldo Atual</span>
                        <span className="text-sm md:text-lg font-bold text-emerald-400">R$ 12.450,00</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 md:ml-0">
                        <button className="p-2 text-zinc-400 hover:text-white relative">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border border-white/20"></div>
                    </div>

                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 pb-24">
                    {/* This is where the specific dashboard widgets will go */}
                    <div className="w-full flex flex-col items-center justify-start pt-12 text-zinc-500 space-y-8">

                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                            <NewSaleButton className="w-full" />
                            <SalesHistoryButton className="w-full" />
                            <ManagementActions className="col-span-1 md:col-span-2" />
                            <PurchasesButton className="w-full" />
                            <CopyCatalogButton className="w-full" />
                        </div>

                        {/* Recent Sales Section */}
                        <RecentSales />

                    </div>
                </main>

            </div >

        </div >
    );
}

function NavItem({ icon, label, active = false, href }: { icon: React.ReactNode, label: string, active?: boolean, href?: string }) {
    if (href) {
        return (
            <Link href={href} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                {icon}
                <span className="font-medium text-sm">{label}</span>
            </Link>
        )
    }
    return (
        <button className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </button>
    )
}
