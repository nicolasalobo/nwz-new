import Image from "next/image";
import { ShoppingBag, ArrowRight, BarChart3, DollarSign, CheckCircle, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative overflow-hidden selection:bg-blue-500 selection:text-white">

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6 z-20 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">NWZ Shop</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

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
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl text-center space-y-8 z-10 mt-10 animate-fade-in animate-delay-100">

        {/* Icon Circle */}
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Bem-vindo ao <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              NWZ Shop
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Sua plataforma completa para gerenciamento de vendas e estoque.
            <br />
            Controle suas operações de forma simples e eficiente.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Acessar Sistema
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 rounded-full glass-button text-white font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            Saiba Mais
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20 mb-10 z-10 animate-fade-in animate-delay-200">
        {/* Card 1 */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold">Controle de Estoque</h3>
          <p className="text-sm text-zinc-400">
            Gerencie seu inventário de forma inteligente
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-cyan-300" />
          </div>
          <h3 className="text-xl font-semibold">Gestão de Vendas</h3>
          <p className="text-sm text-zinc-400">
            Acompanhe suas vendas em tempo real
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-sky-300" />
          </div>
          <h3 className="text-xl font-semibold">Relatórios</h3>
          <p className="text-sm text-zinc-400">
            Analise o desempenho do seu negócio
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-zinc-500 text-sm z-10">
        <p>© 2025 NWZ Shop. Todos os direitos reservados.</p>
      </footer>

    </main>
  );
}
