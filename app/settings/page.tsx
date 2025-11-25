"use client";

import { ArrowLeft, Bell, User, Shield, Smartphone, Moon, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        sales: true,
        stock: true,
        system: false,
    });

    const [appearance, setAppearance] = useState({
        compact: false,
        animations: true,
    });

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center px-6 sticky top-0 z-10">
                <Link href="/dashboard" className="mr-4 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-lg font-bold">Configurações</h1>
            </header>

            <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-8">

                {/* Profile Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-1">Perfil</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl font-bold border-4 border-[#020617]">
                            N
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">Nicolas Lobo</h3>
                            <p className="text-zinc-400">Administrador</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/20">
                                    Acesso Total
                                </span>
                            </div>
                        </div>
                        <button className="text-zinc-400 hover:text-white p-2">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-1">Notificações</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">

                        <ToggleItem
                            icon={<Bell size={20} className="text-purple-400" />}
                            label="Alertas de Vendas"
                            description="Receber notificação a cada nova venda"
                            checked={notifications.sales}
                            onChange={() => setNotifications(prev => ({ ...prev, sales: !prev.sales }))}
                        />

                        <ToggleItem
                            icon={<PackageIcon size={20} className="text-emerald-400" />}
                            label="Estoque Baixo"
                            description="Avisar quando produtos estiverem acabando"
                            checked={notifications.stock}
                            onChange={() => setNotifications(prev => ({ ...prev, stock: !prev.stock }))}
                        />

                        <ToggleItem
                            icon={<Smartphone size={20} className="text-blue-400" />}
                            label="Notificações Push"
                            description="Receber alertas no celular"
                            checked={notifications.system}
                            onChange={() => setNotifications(prev => ({ ...prev, system: !prev.system }))}
                        />

                    </div>
                </section>

                {/* System */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-1">Sistema</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">

                        <ToggleItem
                            icon={<Moon size={20} className="text-zinc-400" />}
                            label="Modo Escuro"
                            description="O tema sempre será escuro (Padrão)"
                            checked={true}
                            onChange={() => { }}
                            disabled
                        />

                        <ToggleItem
                            icon={<ZapIcon size={20} className="text-amber-400" />}
                            label="Animações"
                            description="Ativar efeitos visuais e transições"
                            checked={appearance.animations}
                            onChange={() => setAppearance(prev => ({ ...prev, animations: !prev.animations }))}
                        />

                    </div>
                </section>

                {/* Security / Danger Zone */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider ml-1">Segurança</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Shield size={20} className="text-zinc-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Alterar Senha</p>
                                    <p className="text-xs text-zinc-500">Última alteração há 30 dias</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-zinc-500" />
                        </button>

                        <button className="w-full p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    <LogOut size={20} className="text-red-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-red-400">Sair da Conta</p>
                                    <p className="text-xs text-red-400/60">Encerrar sessão atual</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <div className="text-center text-xs text-zinc-600 pt-8 pb-4">
                    NWZ System v1.0.0 • Build 2024
                </div>

            </main>
        </div>
    );
}

function ToggleItem({ icon, label, description, checked, onChange, disabled = false }: any) {
    return (
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    {icon}
                </div>
                <div>
                    <p className={`font-medium ${disabled ? 'text-zinc-500' : 'text-white'}`}>{label}</p>
                    <p className="text-xs text-zinc-500">{description}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                disabled={disabled}
                className={`
                    w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out
                    ${checked ? 'bg-blue-600' : 'bg-zinc-700'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <div className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out
                    ${checked ? 'left-7' : 'left-1'}
                `} />
            </button>
        </div>
    )
}

// Icons
function PackageIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-10" />
        </svg>
    )
}

function ZapIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
