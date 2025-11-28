"use client";

import { useState } from "react";
import { ArrowLeft, Search, Plus, User, Phone, MoreVertical, Edit, Trash2, AlertCircle, ShoppingBag, Gift, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ClientModal from "@/components/clients/ClientModal";

import { CLIENTS } from "@/app/data/mock";

export default function ClientsPage() {
    const [clients, setClients] = useState(CLIENTS);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);

    const handleSaveClient = (clientData: any) => {
        if (editingClient) {
            // Edit
            setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
        } else {
            // Add
            const newClient = {
                id: Math.random().toString(36).substr(2, 9),
                ...clientData,
                totalDebt: 0,
                totalPurchases: 0,
                purchaseCount: 0,
                totalUnits: 0
            };
            setClients([...clients, newClient]);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const handleDeleteClient = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este cliente?")) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    const handleRedeemReward = (clientId: string) => {
        if (confirm("Confirmar retirada de brinde? Isso descontará 10 unidades do saldo do cliente.")) {
            setClients(clients.map(c => {
                if (c.id === clientId && c.totalUnits >= 10) {
                    return { ...c, totalUnits: c.totalUnits - 10 };
                }
                return c;
            }));
        }
    };

    const openEditModal = (client: any) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Clientes & Fidelidade</h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Novo Cliente</span>
                </button>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>

                {/* Clients List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group relative overflow-hidden flex flex-col">

                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${client.totalDebt > 0 || client.status === 'blocked' ? 'bg-red-500' : 'bg-emerald-500'
                                }`} />

                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 font-bold text-lg">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{client.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                                            <Phone size={10} />
                                            {client.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditModal(client)}
                                        className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClient(client.id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Loyalty Stats */}
                            <div className="pl-3 mb-4 flex gap-2">
                                <div className="flex-1 bg-black/20 rounded-lg p-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
                                        <ShoppingBag size={14} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Compras</span>
                                        <span className="text-sm font-bold text-white">{client.purchaseCount || 0}</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black/20 rounded-lg p-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-500/10 rounded text-purple-400">
                                        <Gift size={14} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Unidades</span>
                                        <span className="text-sm font-bold text-white">{client.totalUnits || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reward Progress */}
                            <div className="pl-3 mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-zinc-500">Próximo Brinde</span>
                                    <span className={client.totalUnits >= 10 ? "text-emerald-400 font-bold" : "text-zinc-400"}>
                                        {client.totalUnits >= 10 ? "Disponível!" : `${client.totalUnits}/10`}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${client.totalUnits >= 10 ? 'bg-emerald-500 animate-pulse' : 'bg-purple-600'}`}
                                        style={{ width: `${Math.min((client.totalUnits / 10) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Reward Button */}
                            {client.totalUnits >= 10 && (
                                <div className="pl-3 mb-4">
                                    <button
                                        onClick={() => handleRedeemReward(client.id)}
                                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Gift size={16} />
                                        Retirar Brinde (-10 Unid)
                                    </button>
                                </div>
                            )}

                            <div className="mt-auto grid grid-cols-2 gap-4 pl-3 pt-4 border-t border-white/5">
                                <div>
                                    <span className="text-xs text-zinc-500 block mb-1">Total Gasto</span>
                                    <span className="text-sm font-bold text-white">R$ {client.totalPurchases.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-500 block mb-1 flex items-center gap-1">
                                        Devendo
                                        {client.totalDebt > 0 && <AlertCircle size={10} className="text-red-500" />}
                                    </span>
                                    <span className={`text-sm font-bold ${client.totalDebt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        R$ {client.totalDebt.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {(client.status === 'blocked' || client.totalDebt > 0) && (
                                <div className="mt-4 pl-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase border border-red-500/20">
                                        <AlertCircle size={10} />
                                        Bloqueado
                                    </span>
                                </div>
                            )}

                        </div>
                    ))}
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        Nenhum cliente encontrado.
                    </div>
                )}

            </main>

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                client={editingClient}
            />

        </div>
    );
}
