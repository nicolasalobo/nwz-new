import { X, Calendar, User, CreditCard, Package, Plus, Banknote, Clock, UserCircle } from "lucide-react";
import { useState } from "react";

interface SaleItem {
    name: string;
    qty: number;
    price: number;
    total: number;
}

interface SaleDetails {
    id: string;
    date: string;
    time: string;
    clientName: string;
    clientType: string;
    registeredBy: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    amountPaid: number;
    paymentMethod: string;
    status: "paid" | "pending" | "open" | "cancelled";
}

interface SaleDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sale: SaleDetails | null;
    onStatusChange?: (newStatus: "paid" | "pending" | "open" | "cancelled") => void;
    onAddPayment?: (amount: number) => void;
}

export default function SaleDetailsModal({ isOpen, onClose, sale, onStatusChange, onAddPayment }: SaleDetailsModalProps) {
    const [paymentAmount, setPaymentAmount] = useState("");

    if (!isOpen || !sale) return null;

    const handleAddPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (amount > 0 && onAddPayment) {
            onAddPayment(amount);
            setPaymentAmount("");
        }
    };

    const remainingAmount = sale.total - (sale.amountPaid || 0);
    const progressPercent = Math.min(100, ((sale.amountPaid || 0) / sale.total) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div>
                        <h2 className="text-lg font-bold text-white">Detalhes da Venda</h2>
                        <p className="text-xs text-zinc-400 font-mono">ID: {sale.id}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase font-medium">
                                <Calendar size={12} /> Data & Hora
                            </div>
                            <p className="text-white font-medium">{sale.date} às {sale.time}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase font-medium">
                                <User size={12} /> Cliente
                            </div>
                            <p className="text-white font-medium">{sale.clientName}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                {sale.clientType}
                            </span>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase font-medium">
                                <UserCircle size={12} /> Vendedor
                            </div>
                            <p className="text-white font-medium">{sale.registeredBy}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase font-medium border-b border-white/5 pb-2">
                            <Package size={12} /> Itens do Pedido
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {sale.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 flex items-center justify-center bg-white/5 rounded text-xs font-mono text-zinc-400">
                                            {item.qty}x
                                        </span>
                                        <span className="text-zinc-200">{item.name}</span>
                                    </div>
                                    <span className="text-white font-medium">
                                        R$ {item.total.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/5">
                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Subtotal</span>
                            <span>R$ {sale.subtotal.toFixed(2)}</span>
                        </div>
                        {sale.discount > 0 && (
                            <div className="flex justify-between text-sm text-emerald-400">
                                <span>Desconto</span>
                                <span>- R$ {sale.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-xl font-bold text-blue-400">R$ {sale.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Partial Payment Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase text-zinc-500">
                            <span>Pagamentos</span>
                            <span>Restante: <span className="text-white">R$ {remainingAmount.toFixed(2)}</span></span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${remainingAmount <= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>Pago: R$ {(sale.amountPaid || 0).toFixed(2)}</span>
                            <span>{progressPercent.toFixed(0)}%</span>
                        </div>

                        {/* Add Payment Input */}
                        {remainingAmount > 0 && onAddPayment && (
                            <div className="flex gap-2 pt-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Valor"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleAddPayment}
                                    disabled={!paymentAmount}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Adicionar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <CreditCard size={12} />
                            <span>Pagamento: <span className="text-zinc-300 capitalize">{sale.paymentMethod}</span></span>
                        </div>

                        {onStatusChange ? (
                            <select
                                value={sale.status}
                                onChange={(e) => onStatusChange(e.target.value as any)}
                                className={`px-2 py-1 rounded-lg border text-[10px] uppercase font-bold outline-none cursor-pointer ${sale.status === 'paid'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : sale.status === 'pending'
                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            : sale.status === 'open'
                                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                            >
                                <option value="paid" className="bg-[#0f172a] text-emerald-400">Pago</option>
                                <option value="pending" className="bg-[#0f172a] text-amber-400">Pendente</option>
                                <option value="open" className="bg-[#0f172a] text-blue-400">Aberto</option>
                                <option value="cancelled" className="bg-[#0f172a] text-red-400">Cancelado</option>
                            </select>
                        ) : (
                            <div className={`px-2 py-1 rounded-full border text-[10px] uppercase font-bold ${sale.status === 'paid'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : sale.status === 'pending'
                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                        : sale.status === 'open'
                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {sale.status === 'paid' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : sale.status === 'open' ? 'Aberto' : 'Cancelado'}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
