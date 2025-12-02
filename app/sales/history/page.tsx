"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SalesTable from "@/components/sales/SalesTable";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal";

// Mock Data


export default function SalesHistoryPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedSale, setSelectedSale] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/sales')
            .then(res => {
                if (res.status === 401) {
                    router.push('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Map API data to UI format
                    const mappedSales = data.map((sale: any) => ({
                        id: sale.code ? sale.code.replace('#', '') : sale.id.substring(0, 4), // Use code or short ID
                        date: new Date(sale.date).toLocaleDateString('pt-BR'),
                        time: new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        clientName: sale.client?.name || "Cliente Final", // Fallback
                        clientType: sale.clientId ? "Final" : "Outro", // Simplify for now
                        registeredBy: sale.user?.name || "Sistema",
                        total: sale.total,
                        subtotal: sale.subtotal,
                        discount: sale.discount,
                        status: sale.status === 'completed' ? 'paid' : sale.status,
                        paymentMethod: sale.paymentMethod === 'pix' ? 'Pix' : sale.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'A Prazo',
                        amountPaid: sale.amountPaid,
                        items: sale.items.map((item: any) => ({
                            name: item.product?.name || "Produto Removido",
                            qty: item.quantity,
                            price: item.price,
                            total: item.total
                        }))
                    }));
                    setSales(mappedSales);
                }
            })
            .catch(err => console.error("Failed to fetch sales", err));
    }, []);

    const handleViewDetails = (saleId: string) => {
        const sale = sales.find(s => s.id === saleId);
        if (sale) {
            setSelectedSale(sale);
            setIsModalOpen(true);
        }
    };

    const handleStatusChange = (newStatus: "paid" | "pending" | "open" | "cancelled") => {
        if (selectedSale) {
            const updatedSale = { ...selectedSale, status: newStatus };

            // Update local state
            setSales(sales.map(s => s.id === selectedSale.id ? updatedSale : s));
            setSelectedSale(updatedSale);
        }
    };

    const handleAddPayment = (amount: number) => {
        if (selectedSale) {
            const currentPaid = selectedSale.amountPaid || 0;
            const newPaid = currentPaid + amount;

            let newStatus = selectedSale.status;
            if (newPaid >= selectedSale.total) {
                newStatus = "paid";
            } else if (newPaid > 0) {
                newStatus = "pending";
            } else {
                newStatus = "open";
            }

            const updatedSale = {
                ...selectedSale,
                amountPaid: newPaid,
                status: newStatus
            };

            // Update local state
            setSales(sales.map(s => s.id === selectedSale.id ? updatedSale : s));
            setSelectedSale(updatedSale);
        }
    };

    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.id.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || sale.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Histórico de Vendas</h1>
                </div>

                <Link
                    href="/sales/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Nova Venda</span>
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por cliente ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none min-w-[140px]"
                            >
                                <option value="all">Todos Status</option>
                                <option value="paid">Pagos</option>
                                <option value="pending">Pendentes</option>
                                <option value="open">Abertos</option>
                                <option value="cancelled">Cancelados</option>
                            </select>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                            <Calendar size={16} />
                            <span>Hoje</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <SalesTable
                    sales={filteredSales}
                    onViewDetails={handleViewDetails}
                />

            </main>

            {/* Details Modal */}
            <SaleDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sale={selectedSale}
                onStatusChange={handleStatusChange}
                onAddPayment={handleAddPayment}
            />

        </div>
    );
}
