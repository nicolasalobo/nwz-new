import { Edit2, Trash2, Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    image?: string;
}

interface StockTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function StockTable({ products, onEdit, onDelete }: StockTableProps) {

    const getStatus = (stock: number, minStock: number) => {
        if (stock === 0) return { label: "Esgotado", color: "text-red-400 bg-red-400/10", icon: XCircle };
        if (stock <= minStock) return { label: "Baixo Estoque", color: "text-amber-400 bg-amber-400/10", icon: AlertTriangle };
        return { label: "Em Estoque", color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle };
    };

    return (
        <div className="w-full space-y-4">

            {/* Search Bar (Optional enhancement for later, but good to have structure) */}
            {/* <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar produtos..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
            </div> */}

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Produto</th>
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Categoria</th>
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Preço</th>
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Estoque</th>
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Status</th>
                                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const status = getStatus(product.stock, product.minStock);
                                    const StatusIcon = status.icon;

                                    return (
                                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center text-xs font-bold text-blue-200 border border-white/10">
                                                        {product.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-white">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-zinc-400 text-sm">{product.category}</td>
                                            <td className="p-4 text-white font-medium text-right">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="font-mono text-white">{product.stock}</span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => onEdit(product)}
                                                        className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(product.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
