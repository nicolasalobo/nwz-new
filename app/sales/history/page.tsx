"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import SalesTable from "@/components/sales/SalesTable";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal";

// Mock Data
const INITIAL_SALES = [
    {
        id: "1025",
        date: "26/11/2024",
        time: "14:30",
        clientName: "Carlos Eduardo",
        clientType: "Final",
        registeredBy: "Nicolas Lobo",
        total: 250.00,
        subtotal: 250.00,
        discount: 0,
        status: "pending" as const,
        paymentMethod: "A Prazo",
        amountPaid: 80.00,
        items: [
            { name: "Pod Ignite V80 - Watermelon", qty: 2, price: 125.00, total: 250.00 }
        ]
    },
    {
        id: "1024",
        date: "26/11/2024",
        time: "10:15",
        clientName: "João Silva",
        clientType: "Final",
        registeredBy: "Nicolas Lobo",
        total: 185.00,
        subtotal: 185.00,
        discount: 0,
        status: "paid" as const,
        paymentMethod: "Pix",
        amountPaid: 185.00,
        items: [
            { name: "Pod Ignite V80 - Icy Mint", qty: 1, price: 110.00, total: 110.00 },
            { name: "Essência Love 66", qty: 2, price: 37.50, total: 75.00 }
        ]
    },
    {
        id: "1023",
        date: "26/11/2024",
        time: "09:45",
        clientName: "Tabacaria Central",
        clientType: "Parceiro",
        registeredBy: "Admin",
        total: 450.00,
        subtotal: 500.00,
        discount: 50.00,
        status: "open" as const,
        paymentMethod: "Boleto",
        amountPaid: 0,
        items: [
            { name: "Pod Descartável v50 - Mix", qty: 10, price: 45.00, total: 450.00 }
        ]
    },
    {
        id: "1022",
        date: "25/11/2024",
        time: "16:20",
        clientName: "Maria Oliveira",
        clientType: "Final",
        registeredBy: "Nicolas Lobo",
        total: 85.00,
        subtotal: 85.00,
        discount: 0,
        status: "paid" as const,
        paymentMethod: "Cartão de Crédito",
        amountPaid: 85.00,
        items: [
            { name: "Pod Descartável v50 - Grape", qty: 1, price: 85.00, total: 85.00 }
        ]
    },
    {
        id: "1021",
        date: "24/11/2024",
        time: "11:00",
        clientName: "Pedro Santos",
        clientType: "Afiliado",
        registeredBy: "Admin",
        total: 1200.00,
        subtotal: 1200.00,
        discount: 0,
        status: "paid" as const,
        paymentMethod: "Pix",
        amountPaid: 1200.00,
        items: [
            { name: "Kit Atacado Essências", qty: 1, price: 1200.00, total: 1200.00 }
        ]
    },
    {
        id: "1020",
        date: "23/11/2024",
        time: "18:50",
        clientName: "Lucas Pereira",
        clientType: "Final",
        registeredBy: "Nicolas Lobo",
        total: 35.00,
        subtotal: 35.00,
        discount: 0,
        status: "cancelled" as const,
        paymentMethod: "Dinheiro",
        amountPaid: 0,
        items: [
            { name: "Carvão de Coco 1kg", qty: 1, price: 35.00, total: 35.00 }
        ]
    }
];

export default function SalesHistoryPage() {
    const [sales, setSales] = useState(INITIAL_SALES);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedSale, setSelectedSale] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
