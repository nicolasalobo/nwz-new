"use client";

import { useState } from "react";
import { ArrowLeft, Search, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import SalesTable from "@/components/sales/SalesTable";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal";

// Mock Data for a specific Partner (e.g., "Tabacaria Central")
const MY_SALES = [
    {
        id: "1023",
        date: "26/11/2024",
        time: "09:45",
        clientName: "Cliente Final 1",
        clientType: "Final",
        registeredBy: "Tabacaria Central",
        total: 150.00,
        subtotal: 150.00,
        discount: 0,
        status: "paid" as const,
        paymentMethod: "Pix",
        amountPaid: 150.00,
        items: [
            { name: "Pod Ignite V80 - Watermelon", qty: 1, price: 125.00, total: 125.00 },
            { name: "Essência Zomo", qty: 2, price: 12.50, total: 25.00 }
        ]
    },
    {
        id: "1018",
        date: "22/11/2024",
        time: "14:20",
        clientName: "Cliente Final 2",
        clientType: "Final",
        registeredBy: "Tabacaria Central",
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
        id: "1015",
        date: "20/11/2024",
        time: "18:10",
        clientName: "Cliente Final 3",
        clientType: "Final",
        registeredBy: "Tabacaria Central",
        total: 250.00,
        subtotal: 250.00,
        discount: 0,
        status: "pending" as const,
        paymentMethod: "A Prazo",
        amountPaid: 100.00,
        items: [
            { name: "Pod Ignite V80 - Mint", qty: 2, price: 125.00, total: 250.00 }
        ]
    }
];

export default function MySalesHistoryPage() {
    const [sales, setSales] = useState(MY_SALES);
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
                    <h1 className="text-xl font-bold text-white">Minhas Vendas</h1>
                </div>
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
                    </div>
                </div>

                {/* Sales Table */}
                <SalesTable
                    sales={filteredSales}
                    onViewDetails={handleViewDetails}
                />

            </main>

            {/* Details Modal (Read-Only) */}
            <SaleDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sale={selectedSale}
            // No onStatusChange or onAddPayment passed here, making it read-only
            />

        </div>
    );
}
