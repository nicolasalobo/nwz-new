"use client";

import { useState } from "react";
import { ArrowLeft, Search, Plus, Store, User, Shield, Edit, Trash2, Percent } from "lucide-react";
import Link from "next/link";
import AffiliateModal from "@/components/management/AffiliateModal";

// Mock Data
const INITIAL_AFFILIATES = [
    {
        id: "1",
        name: "Curitipods",
        store: "Matriz",
        sellers: ["Alvaro", "Play"],
        commission: 10,
        status: "active" as const
    },
    {
        id: "2",
        name: "Maripods",
        store: "Filial Norte",
        sellers: ["Jumble"],
        commission: 12,
        status: "active" as const
    },
];

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState(INITIAL_AFFILIATES);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAffiliate, setEditingAffiliate] = useState<any>(null);

    const handleSaveAffiliate = (affiliateData: any) => {
        if (editingAffiliate) {
            // Edit
            setAffiliates(affiliates.map(a => a.id === editingAffiliate.id ? { ...a, ...affiliateData } : a));
        } else {
            // Add
            const newAffiliate = {
                id: Math.random().toString(36).substr(2, 9),
                ...affiliateData
            };
            setAffiliates([...affiliates, newAffiliate]);
        }
        setIsModalOpen(false);
        setEditingAffiliate(null);
    };

    const handleDeleteAffiliate = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este afiliado?")) {
            setAffiliates(affiliates.filter(a => a.id !== id));
        }
    };

    const openEditModal = (affiliate: any) => {
        setEditingAffiliate(affiliate);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingAffiliate(null);
        setIsModalOpen(true);
    };

    const filteredAffiliates = affiliates.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.store.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Gerenciar Afiliados</h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Novo Afiliado</span>
                </button>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou loja..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>

                {/* Affiliates List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAffiliates.map((affiliate) => (
                        <div key={affiliate.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-lg border border-purple-500/20">
                                        {affiliate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{affiliate.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                                            <Store size={10} />
                                            {affiliate.store}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditModal(affiliate)}
                                        className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAffiliate(affiliate.id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-col gap-1 text-sm bg-black/20 p-2 rounded-lg">
                                    <span className="text-zinc-500 flex items-center gap-2">
                                        <Shield size={14} /> Vendedores
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {affiliate.sellers.map((seller: string, idx: number) => (
                                            <span key={idx} className="px-2 py-0.5 bg-white/5 rounded text-xs text-zinc-300 border border-white/5">
                                                {seller}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm bg-black/20 p-2 rounded-lg">
                                    <span className="text-zinc-500 flex items-center gap-2">
                                        <Percent size={14} /> Comissão
                                    </span>
                                    <span className="text-emerald-400 font-bold">{affiliate.commission}%</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${affiliate.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                    }`}>
                                    {affiliate.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>

                {filteredAffiliates.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        Nenhum afiliado encontrado.
                    </div>
                )}

            </main>

            <AffiliateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAffiliate}
                affiliate={editingAffiliate}
            />

        </div>
    );
}
