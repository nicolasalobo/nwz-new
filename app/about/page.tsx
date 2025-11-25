import Image from "next/image";
import { ArrowLeft, CheckCircle, BarChart3, DollarSign, User } from "lucide-react";
import Link from "next/link";

export default function About() {
    return (
        <main className="flex min-h-screen flex-col items-center p-6 relative overflow-hidden selection:bg-blue-500 selection:text-white">

            {/* Header */}
            <header className="w-full max-w-6xl flex justify-between items-center py-6 z-20 animate-fade-in">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-xl font-bold tracking-tight">NWZ Shop</span>
                    </Link>
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

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center w-full max-w-4xl z-10 mt-10 animate-fade-in animate-delay-100">

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-12">
                    Sobre o <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        NWZ Shop
                    </span>
                </h1>

                <div className="glass-card p-8 md:p-12 w-full space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">O Ecossistema NWZ</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            O NWZ Shop é a plataforma central que conecta eficiência operacional e crescimento estratégico.
                            Desenvolvida para atender tanto às necessidades de gestão interna quanto ao acompanhamento de nossos parceiros.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-semibold text-white">Para Usuários</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Controle total de vendas e estoque. Gerencie operações diárias com agilidade e precisão, garantindo que o negócio nunca pare.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-cyan-400" />
                                <h3 className="text-xl font-semibold text-white">Para Parceiros</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Acompanhe seu progresso e recompensas em tempo real. Tenha visibilidade clara do seu desempenho e das metas alcançadas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-center">
                    <Link
                        href="/login"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        Começar Agora
                        <CheckCircle className="w-5 h-5" />
                    </Link>
                </div>
            </div>


            {/* Footer */}
            <footer className="w-full text-center py-6 text-zinc-500 text-sm z-10">
                <p>© 2025 NWZ Shop. Todos os direitos reservados.</p>
            </footer>

        </main >
    );
}
