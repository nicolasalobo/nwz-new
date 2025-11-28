import { X, User, Phone, Mail, FileText, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface Client {
    id: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    totalDebt: number;
    totalPurchases: number;
    purchaseCount: number;
    totalUnits: number;
    status: "active" | "blocked";
}

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    client: Client | null;
}

export default function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        notes: "",
        purchaseCount: 0,
        totalUnits: 0,
        status: "active" as "active" | "blocked"
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                phone: client.phone,
                email: client.email,
                notes: client.notes,
                purchaseCount: client.purchaseCount || 0,
                totalUnits: client.totalUnits || 0,
                status: client.status
            });
        } else {
            setFormData({
                name: "",
                phone: "",
                email: "",
                notes: "",
                purchaseCount: 0,
                totalUnits: 0,
                status: "active"
            });
        }
    }, [client, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white">
                        {client ? "Editar Cliente" : "Novo Cliente"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: João Silva"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Telefone / WhatsApp</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Email (Opcional)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="cliente@email.com"
                            />
                        </div>
                    </div>

                    {/* Loyalty Stats (Manual Adjustment) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Nº Compras</label>
                            <input
                                type="number"
                                value={formData.purchaseCount}
                                onChange={(e) => setFormData({ ...formData, purchaseCount: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Total Unidades</label>
                            <input
                                type="number"
                                value={formData.totalUnits}
                                onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Observações</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-zinc-500" size={16} />
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[80px] resize-none"
                                placeholder="Ex: Cliente prefere entrega à tarde..."
                            />
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-zinc-400">Status da Conta</span>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: formData.status === "active" ? "blocked" : "active" })}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${formData.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            {formData.status === "active" ? "ATIVO" : "BLOQUEADO"}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Salvar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
