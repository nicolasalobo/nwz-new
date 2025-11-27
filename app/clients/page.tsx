"use client";

import { useState } from "react";
import { ArrowLeft, Search, Plus, User, Phone, MoreVertical, Edit, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ClientModal from "@/components/clients/ClientModal";

// Mock Data
const INITIAL_CLIENTS = [
    {
        id: "1",
        name: "Carlos Eduardo",
        phone: "(11) 99999-1234",
        email: "carlos@email.com",
        notes: "Cliente fiel, sempre compra Pods.",
        totalDebt: 150.00,
        totalPurchases: 1250.00,
        status: "active" as const
    },
    {
        id: "2",
        name: "Ana Clara",
        phone: "(11) 98888-5678",
        email: "ana@email.com",
        notes: "",
        totalDebt: 0,
        totalPurchases: 450.00,
        status: "active" as const
    },
    {
        id: "3",
        name: "Roberto Souza",
        phone: "(11) 97777-4321",
        email: "",
        notes: "Atrasou pagamento mês passado.",
        totalDebt: 580.00,
        totalPurchases: 2100.00,
        status: "blocked" as const
    },
    {
        id: "4",
        name: "Mariana Lima",
        phone: "(11) 96666-8765",
        email: "mari@email.com",
        notes: "",
        totalDebt: 0,
        totalPurchases: 85.00,
        status: "active" as const
    },
];

export default function ClientsPage() {
    const [clients, setClients] = useState(INITIAL_CLIENTS);
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
                totalPurchases: 0
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
                    <h1 className="text-xl font-bold text-white">Clientes</h1>
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
                        <div key={client.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group relative overflow-hidden">

                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${client.status === 'blocked' ? 'bg-red-500' :
                                    client.totalDebt > 0 ? 'bg-amber-500' : 'bg-emerald-500'
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

                            <div className="grid grid-cols-2 gap-4 pl-3">
                                <div className="bg-black/20 rounded-lg p-3">
                                    <span className="text-xs text-zinc-500 block mb-1">Total Comprado</span>
                                    <span className="text-sm font-bold text-white">R$ {client.totalPurchases.toFixed(2)}</span>
                                </div>
                                <div className={`bg-black/20 rounded-lg p-3 border ${client.totalDebt > 0 ? 'border-amber-500/30' : 'border-transparent'}`}>
                                    <span className="text-xs text-zinc-500 block mb-1 flex items-center gap-1">
                                        Devendo
                                        {client.totalDebt > 0 && <AlertCircle size={10} className="text-amber-500" />}
                                    </span>
                                    <span className={`text-sm font-bold ${client.totalDebt > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        R$ {client.totalDebt.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {client.status === 'blocked' && (
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
