import Image from "next/image";
import { ArrowLeft, Mail, Lock, LogIn, User } from "lucide-react";
import Link from "next/link";

export default function Login() {
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

            {/* Login Card */}
            <div className="w-full max-w-md z-10 animate-fade-in">

                <div className="glass-card p-8 md:p-10 space-y-8 shadow-2xl shadow-blue-900/20 border-white/10">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <LogIn className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Acessar Sistema</h1>
                        <p className="text-zinc-400 text-sm">Entre com suas credenciais para continuar</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Usuário</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="seu.usuario"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-zinc-300">Senha</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Esqueceu a senha?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                        >
                            Entrar
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
