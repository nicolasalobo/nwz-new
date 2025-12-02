"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SalesTable from "@/components/sales/SalesTable";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal";

export default function MySalesHistoryPage() {
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
                        id: sale.code ? sale.code.replace('#', '') : sale.id.substring(0, 4),
                        date: new Date(sale.date).toLocaleDateString('pt-BR'),
                        time: new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        clientName: sale.client?.name || "Cliente Final",
                        clientType: sale.clientId ? "Final" : "Outro",
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
    }, [router]);


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
