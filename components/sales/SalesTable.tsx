import { Eye, MoreHorizontal } from "lucide-react";

interface Sale {
    id: string;
    date: string;
    clientName: string;
    total: number;
    status: "paid" | "pending" | "open" | "cancelled";
}

interface SalesTableProps {
    sales: Sale[];
    onViewDetails: (saleId: string) => void;
}

export default function SalesTable({ sales, onViewDetails }: SalesTableProps) {
    return (
        <div className="w-full bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-xs uppercase text-zinc-400 font-medium">
                            <th className="p-4 pl-6">ID</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {sales.map((sale) => (
                            <tr key={sale.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4 pl-6 font-mono text-zinc-500">#{sale.id}</td>
                                <td className="p-4 text-zinc-300">{sale.date}</td>
                                <td className="p-4 font-medium text-white">{sale.clientName}</td>
                                <td className="p-4 font-bold text-blue-400">R$ {sale.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sale.status === 'paid'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : sale.status === 'pending'
                                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                : sale.status === 'open'
                                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        {sale.status === 'paid' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : sale.status === 'open' ? 'Aberto' : 'Cancelado'}
                                    </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <button
                                        onClick={() => onViewDetails(sale.id)}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                        title="Ver Detalhes"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sales.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-zinc-500">
                                    Nenhuma venda encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mock */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                <span>Mostrando {sales.length} resultados</span>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 rounded bg-white/5 text-zinc-600 cursor-not-allowed">Anterior</button>
                    <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors">Próxima</button>
                </div>
            </div>
        </div>
    );
}
