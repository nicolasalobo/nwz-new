import Image from "next/image";
import { ArrowLeft, User, Lock, UserPlus, Shield, Check } from "lucide-react";
import Link from "next/link";

export default function Register() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500 selection:text-white">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />

                {/* Background Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.15] pointer-events-none">
                    <Image
                        src="/logo.jpg"
                        alt="NWZ Background Logo"
                        fill
                        className="object-contain grayscale"
                        priority
                    />
                </div>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md z-10 animate-fade-in my-10">

                <div className="glass-card p-8 md:p-10 space-y-8 shadow-2xl shadow-blue-900/20 border-white/10">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Novo Membro</h1>
                        <p className="text-zinc-400 text-sm">Cadastrar um novo usuário no sistema</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Nome Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ex: João Silva"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Usuário de Acesso</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="joao.silva"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Senha</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Confirmar</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Check className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Cargo / Permissão</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                                    <option value="nwz" className="bg-zinc-900 text-white">NWZ (Admin)</option>
                                    <option value="parceiro" className="bg-zinc-900 text-white">Parceiro</option>
                                    <option value="afiliado" className="bg-zinc-900 text-white">Afiliado</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-4"
                        >
                            Cadastrar Membro
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para o início
                        </Link>
                    </div>

                </div>
            </div>

        </main>
    );
}
