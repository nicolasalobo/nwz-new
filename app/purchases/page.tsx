"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search, Filter, ShoppingBag, Tag, Calendar, DollarSign, MoreVertical, Trash2, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Mock Data
const INITIAL_PURCHASES = [
    { id: 1, name: "500 Caixas Personalizadas", category: "Embalagem", quantity: 500, totalCost: 1250.00, date: "2023-11-20", supplier: "Gráfica Rápida" },
    { id: 2, name: "1000 Etiquetas Adesivas", category: "Embalagem", quantity: 1000, totalCost: 150.00, date: "2023-11-22", supplier: "Print Web" },
    { id: 3, name: "50 Kits de Brinde (Doces)", category: "Brinde", quantity: 50, totalCost: 200.00, date: "2023-11-25", supplier: "Doceria Local" },
    { id: 4, name: "Material de Escritório", category: "Escritório", quantity: 1, totalCost: 85.90, date: "2023-11-15", supplier: "Papelaria Central" },
];

const CATEGORIES = ["Embalagem", "Brinde", "Escritório", "Marketing", "Outros"];

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState({
        name: "",
        category: "Embalagem",
        quantity: "",
        totalCost: "",
        date: new Date().toISOString().split('T')[0],
        supplier: ""
    });

    const filteredPurchases = purchases.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSpent = purchases.reduce((acc, p) => acc + p.totalCost, 0);
    const currentMonthSpent = purchases.filter(p => p.date.startsWith("2023-11")).reduce((acc, p) => acc + p.totalCost, 0);

    const handleAddPurchase = () => {
        if (!newItem.name || !newItem.totalCost) return;

        const newPurchase = {
            id: purchases.length + 1,
            name: newItem.name,
            category: newItem.category,
            quantity: Number(newItem.quantity) || 1,
            totalCost: parseFloat(newItem.totalCost),
            date: newItem.date,
            supplier: newItem.supplier || "N/A"
        };

        setPurchases([newPurchase, ...purchases]);
        setIsModalOpen(false);
        setNewItem({
            name: "",
            category: "Embalagem",
            quantity: "",
            totalCost: "",
            date: new Date().toISOString().split('T')[0],
            supplier: ""
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir esta despesa?")) {
            setPurchases(purchases.filter(p => p.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 pb-24 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-2 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">
                            Compras & Despesas
                        </h1>
                        <p className="text-zinc-400">Gerencie a aquisição de suprimentos e custos operacionais.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={20} />
                        Registrar Despesa
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-zinc-400 text-sm">Gasto Total Acumulado</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                <Calendar size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            R$ {currentMonthSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-zinc-400 text-sm">Gasto Este Mês</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <ShoppingBag size={24} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{purchases.length}</h3>
                        <p className="text-zinc-400 text-sm">Registros de Compra</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por item ou fornecedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/10 transition-colors">
                        <Filter size={20} />
                        Filtros
                    </button>
                </div>

                {/* Purchases List */}
                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-medium">Item</th>
                                    <th className="p-4 font-medium">Categoria</th>
                                    <th className="p-4 font-medium">Fornecedor</th>
                                    <th className="p-4 font-medium">Data</th>
                                    <th className="p-4 font-medium">Custo Total</th>
                                    <th className="p-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPurchases.map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium text-white">{purchase.name}</p>
                                                <p className="text-xs text-zinc-400">{purchase.quantity} unidades</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-zinc-300 border border-white/10">
                                                {purchase.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-zinc-300">
                                            {purchase.supplier}
                                        </td>
                                        <td className="p-4 text-zinc-300">
                                            {new Date(purchase.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-orange-400">
                                                R$ {purchase.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(purchase.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredPurchases.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">
                            Nenhuma despesa encontrada.
                        </div>
                    )}
                </div>

            </div>

            {/* New Purchase Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#18181B] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="text-orange-400" size={20} />
                                Nova Despesa
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Nome do Item</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="Ex: Caixas de Papelão"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Categoria</label>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Quantidade</label>
                                    <input
                                        type="number"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        placeholder="1"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Custo Total (R$)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                        <input
                                            type="number"
                                            value={newItem.totalCost}
                                            onChange={(e) => setNewItem({ ...newItem, totalCost: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Data</label>
                                    <input
                                        type="date"
                                        value={newItem.date}
                                        onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Fornecedor (Opcional)</label>
                                <input
                                    type="text"
                                    value={newItem.supplier}
                                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                                    placeholder="Nome do Fornecedor"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddPurchase}
                                disabled={!newItem.name || !newItem.totalCost}
                                className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                Salvar Despesa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
