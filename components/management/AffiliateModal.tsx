import { X, User, Store, Shield, Percent, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface Affiliate {
    id: string;
    name: string;
    store: string;
    sellers: string[];
    commission: number;
    status: "active" | "inactive";
}

interface AffiliateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (affiliate: Partial<Affiliate>) => void;
    affiliate: Affiliate | null;
}

export default function AffiliateModal({ isOpen, onClose, onSave, affiliate }: AffiliateModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        store: "",
        sellers: "",
        commission: 10,
        status: "active" as "active" | "inactive"
    });

    useEffect(() => {
        if (affiliate) {
            setFormData({
                name: affiliate.name,
                store: affiliate.store,
                sellers: affiliate.sellers.join(", "),
                commission: affiliate.commission,
                status: affiliate.status
            });
        } else {
            setFormData({
                name: "",
                store: "",
                sellers: "",
                commission: 10,
                status: "active"
            });
        }
    }, [affiliate, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            sellers: formData.sellers.split(",").map(s => s.trim()).filter(s => s !== "")
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white">
                        {affiliate ? "Editar Afiliado" : "Novo Afiliado"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Nome do Afiliado</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ex: Loja Centro"
                            />
                        </div>
                    </div>

                    {/* Store */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Loja / Unidade</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <select
                                value={formData.store}
                                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                            >
                                <option value="">Selecione a Loja...</option>
                                <option value="Matriz">Matriz - Centro</option>
                                <option value="Filial Norte">Filial Norte</option>
                                <option value="Filial Sul">Filial Sul</option>
                                <option value="Quiosque Shopping">Quiosque Shopping</option>
                            </select>
                        </div>
                    </div>

                    {/* Sellers */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Vendedores (Separados por vírgula)</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-3 text-zinc-500" size={16} />
                            <textarea
                                value={formData.sellers}
                                onChange={(e) => setFormData({ ...formData, sellers: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[80px] resize-none"
                                placeholder="Ex: Alvaro, Play"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-500">Liste os nomes dos vendedores que podem acessar este afiliado.</p>
                    </div>

                    {/* Commission */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Comissão (%)</label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.commission}
                                onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-zinc-400">Status</span>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: formData.status === "active" ? "inactive" : "active" })}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${formData.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                }`}
                        >
                            {formData.status === "active" ? "ATIVO" : "INATIVO"}
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
