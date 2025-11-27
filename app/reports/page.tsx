'use client';

import { useState } from "react";
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, ShoppingBag, PieChart, Gift } from "lucide-react";
import Link from "next/link";
import MetricCard from "@/components/reports/MetricCard";
import SalesChart from "@/components/reports/SalesChart";

export default function ReportsPage() {
    const [role, setRole] = useState<"admin" | "partner" | "affiliate">("admin");
    const [dateRange, setDateRange] = useState("Últimos 30 dias");

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Relatórios e Analytics</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Role Switcher (Demo) */}
                    <div className="hidden md:flex bg-white/5 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setRole("admin")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "admin" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole("partner")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "partner" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Parceiro
                        </button>
                        <button
                            onClick={() => setRole("affiliate")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "affiliate" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Afiliado
                        </button>
                    </div>

                    {/* Date Picker Mock */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">
                        <Calendar size={16} className="text-zinc-400" />
                        <span>{dateRange}</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">

                {/* Role Indicator (Mobile) */}
                <div className="md:hidden flex justify-center mb-4">
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setRole("admin")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "admin" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole("partner")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "partner" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Parceiro
                        </button>
                        <button
                            onClick={() => setRole("affiliate")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${role === "affiliate" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Afiliado
                        </button>
                    </div>
                </div>

                {/* ADMIN VIEW */}
                {role === "admin" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                label="Faturamento Total"
                                value="R$ 45.250,00"
                                trend="+12.5%"
                                trendUp={true}
                                icon={DollarSign}
                                color="blue"
                            />
                            <MetricCard
                                label="Lucro Líquido"
                                value="R$ 18.400,00"
                                trend="+8.2%"
                                trendUp={true}
                                icon={TrendingUp}
                                color="emerald"
                            />
                            <MetricCard
                                label="Total de Pedidos"
                                value="342"
                                trend="-2.1%"
                                trendUp={false}
                                icon={ShoppingBag}
                                color="purple"
                            />
                            <MetricCard
                                label="Novos Clientes"
                                value="48"
                                trend="+15.3%"
                                trendUp={true}
                                icon={Users}
                                color="amber"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <SalesChart />
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Top Produtos</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                                                    💨
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">Pod Ignite V{80 + i * 10}</p>
                                                    <p className="text-xs text-zinc-500">{120 - i * 15} vendas</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-emerald-400">R$ {12000 - i * 1500}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* PARTNER VIEW */}
                {role === "partner" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                label="Comissões a Receber"
                                value="R$ 1.250,00"
                                trend="+5.4%"
                                trendUp={true}
                                icon={DollarSign}
                                color="emerald"
                            />
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                        <Gift size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                        Meta: 10
                                    </span>
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-sm font-medium mb-2">Progresso do Brinde</p>
                                    <div className="flex items-end gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-white">7<span className="text-zinc-500 text-lg">/10</span></h3>
                                        <span className="text-xs text-zinc-400 mb-1">vendas</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-2">Faltam 3 vendas para seu brinde!</p>
                                </div>
                            </div>
                            <MetricCard
                                label="Total Vendido"
                                value="R$ 12.500,00"
                                trend="+12%"
                                trendUp={true}
                                icon={ShoppingBag}
                                color="purple"
                            />
                        </div>

                        <SalesChart />
                    </>
                )}

                {/* AFFILIATE VIEW (CEO Mode) */}
                {role === "affiliate" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                label="Faturamento da Loja"
                                value="R$ 42.800,00"
                                trend="+15.4%"
                                trendUp={true}
                                icon={ShoppingBag}
                                color="blue"
                            />
                            <MetricCard
                                label="Lucro da Operação"
                                value="R$ 12.450,00"
                                trend="+8.2%"
                                trendUp={true}
                                icon={TrendingUp}
                                color="emerald"
                            />
                            <MetricCard
                                label="Vendas Totais"
                                value="156"
                                trend="+12%"
                                trendUp={true}
                                icon={ShoppingBag}
                                color="purple"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Team Performance */}
                            <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Desempenho da Equipe</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: "Alvaro", sales: "R$ 18.500,00", count: 68, trend: "+12%" },
                                        { name: "Play", sales: "R$ 15.200,00", count: 54, trend: "+8%" },
                                        { name: "Outros", sales: "R$ 9.100,00", count: 34, trend: "+5%" }
                                    ].map((seller, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/20">
                                                    {seller.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{seller.name}</h4>
                                                    <p className="text-xs text-zinc-400">{seller.count} vendas realizadas</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-white text-lg">{seller.sales}</p>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    {seller.trend}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Commission History */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Histórico de Repasses</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <DollarSign size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">Repasse {i === 1 ? "Nov" : i === 2 ? "Out" : i === 3 ? "Set" : "Ago"}</p>
                                                    <p className="text-[10px] text-zinc-500">Pago em 05/{12 - i}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-emerald-400 text-sm">R$ {4000 + i * 150},00</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}
