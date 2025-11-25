import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center justify-center p-6">

            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">👥</span>
                </div>

                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Meus Clientes
                </h1>

                <p className="text-zinc-400">
                    Aqui você poderá gerenciar sua base de clientes.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mt-8"
                >
                    <ArrowLeft size={20} />
                    <span>Voltar ao Painel</span>
                </Link>
            </div>

        </div>
    );
}
