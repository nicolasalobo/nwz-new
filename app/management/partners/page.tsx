"use client";

import { useState, useEffect } from "react";
import { Users, Search, Filter, MoreVertical, Plus, Gift, DollarSign, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Mock Data


export default function PartnersManagementPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [selectedUserToLink, setSelectedUserToLink] = useState("");
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);

    const filteredPartners = partners.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (partner.email && partner.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        fetchPartners();
        fetchUsers();
    }, []);

    const fetchPartners = () => {
        fetch('/api/partners')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPartners(data);
            })
            .catch(err => console.error("Failed to fetch partners", err));
    };

    const fetchUsers = () => {
        // We need an endpoint to fetch users who are NOT partners yet
        // For now, we'll fetch all users and filter client-side or use a dedicated endpoint
        // Let's assume we use a simple GET /api/users (which we might need to create or use existing)
        // Since we don't have a dedicated /api/users for this, let's create a quick one or reuse logic
        // For MVP, let's just fetch from a new endpoint /api/users/available-for-partner
        fetch('/api/users/available-for-partner')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAvailableUsers(data);
            })
            .catch(err => console.error("Failed to fetch users", err));
    };

    const handleLinkUser = async () => {
        if (!selectedUserToLink) return;

        try {
            const res = await fetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUserToLink }),
            });

            if (res.ok) {
                fetchPartners();
                fetchUsers(); // Refresh available users
                setIsLinkModalOpen(false);
                setSelectedUserToLink("");
            } else {
                const err = await res.json();
                alert(`Erro ao vincular parceiro: ${err.error}`);
            }
        } catch (error) {
            console.error("Error linking partner", error);
            alert("Erro ao vincular parceiro.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 pb-24 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Gestão de Parceiros
                        </h1>
                        <p className="text-zinc-400">Gerencie seus parceiros, comissões e metas.</p>
                    </div>
                    <button
                        onClick={() => setIsLinkModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} />
                        Vincular Parceiro
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Users size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{partners.length}</h3>
                        <p className="text-zinc-400 text-sm">Parceiros Ativos</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            R$ {partners.reduce((acc, p) => acc + p.commissionBalance, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-zinc-400 text-sm">Comissões a Pagar</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <Gift size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            {partners.filter(p => p.unitProgress >= 9).length}
                        </h3>
                        <p className="text-zinc-400 text-sm">Próximos do Brinde</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar parceiro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/10 transition-colors">
                        <Filter size={20} />
                        Filtros
                    </button>
                </div>

                {/* Partners List */}
                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-medium">Parceiro</th>
                                    <th className="p-4 font-medium">Saldo (R$)</th>
                                    <th className="p-4 font-medium">Meta (Brinde)</th>
                                    <th className="p-4 font-medium">Total Vendas</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {partner.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{partner.name}</p>
                                                    <p className="text-xs text-zinc-400">{partner.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                                <DollarSign size={16} />
                                                R$ {partner.commissionBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-blue-400 font-bold">{partner.unitProgress}/10</span>
                                                </div>
                                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(partner.unitProgress / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-zinc-300">
                                            {partner.totalSales} vendas
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${partner.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                                }`}>
                                                {partner.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredPartners.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">
                            Nenhum parceiro encontrado.
                        </div>
                    )}
                </div>

                {/* Link User Modal */}
                {isLinkModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-[#18181B] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Vincular Novo Parceiro</h2>
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={20} className="rotate-180" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-zinc-400 text-sm">
                                    Selecione um usuário existente para torná-lo um parceiro oficial.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Usuário</label>
                                    <select
                                        value={selectedUserToLink}
                                        onChange={(e) => setSelectedUserToLink(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Selecione um usuário...</option>
                                        {availableUsers.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.username})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleLinkUser}
                                    disabled={!selectedUserToLink}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle2 size={18} />
                                    Vincular
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
