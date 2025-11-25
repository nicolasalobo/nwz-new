import { ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Sale {
    id: string;
    customer: string;
    amount: string;
    status: "completed" | "pending" | "processing";
    date: string;
}

const mockSales: Sale[] = [
    { id: "1", customer: "Maria Silva", amount: "R$ 150,00", status: "completed", date: "Hoje, 14:30" },
    { id: "2", customer: "João Santos", amount: "R$ 89,90", status: "processing", date: "Hoje, 13:15" },
    { id: "3", customer: "Ana Oliveira", amount: "R$ 210,50", status: "completed", date: "Hoje, 11:45" },
    { id: "4", customer: "Pedro Costa", amount: "R$ 45,00", status: "pending", date: "Ontem, 18:20" },
    { id: "5", customer: "Lucas Pereira", amount: "R$ 120,00", status: "completed", date: "Ontem, 16:10" },
];

interface RecentSalesProps {
    role?: "admin" | "partner" | "affiliate";
}

export default function RecentSales({ role = "admin" }: RecentSalesProps) {
    const historyLink = role === "admin" ? "/sales/history" : "/sales/my-history";

    // Filter mock data based on role to simulate different views
    const displaySales = role === "admin"
        ? mockSales
        : role === "partner"
            ? [mockSales[0], mockSales[2], mockSales[4]] // Simulate specific user sales
            : [mockSales[1], mockSales[3]]; // Simulate store sales

    return (
        <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">

            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Últimas Vendas</h2>
                <Link
                    href={historyLink}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                    Ver todas <ArrowRight size={14} />
                </Link>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5">
                {displaySales.map((sale) => (
                    <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">

                        <div className="flex items-center gap-4">
                            {/* Avatar Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                {sale.customer.split(" ").map(n => n[0]).join("").substring(0, 2)}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white">{sale.customer}</p>
                                <p className="text-xs text-zinc-500">{sale.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{sale.amount}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sale.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                    sale.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-amber-500/10 text-amber-400'
                                    }`}>
                                    {sale.status === 'completed' ? 'Pago' :
                                        sale.status === 'processing' ? 'Processando' : 'Pendente'}
                                </span>
                            </div>

                            <button className="text-zinc-500 hover:text-white p-1">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
