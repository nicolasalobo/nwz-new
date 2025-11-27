"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search, Upload, Layers } from "lucide-react";
import Link from "next/link";
import StockTable from "@/components/management/StockTable";
import ProductModal from "@/components/management/ProductModal";
import BulkImportModal from "@/components/management/BulkImportModal";
import CategoryModal from "@/components/management/CategoryModal";

// Mock Data
const INITIAL_PRODUCTS = [
    { id: "1", name: "Pod Descartável v50", category: "Pod Descartável", price: 85.00, stock: 45, minStock: 10 },
    { id: "2", name: "Essência Love 66", category: "Essência", price: 18.00, stock: 120, minStock: 20 },
    { id: "3", name: "Carvão de Coco 1kg", category: "Carvão", price: 35.00, stock: 8, minStock: 15 },
    { id: "4", name: "Alumínio Predator", category: "Acessórios", price: 12.00, stock: 50, minStock: 10 },
    { id: "5", name: "Pod Ignite V80", category: "Pod Descartável", price: 110.00, stock: 0, minStock: 5 },
];

const INITIAL_CATEGORIES = [
    "Pod Descartável",
    "Essência",
    "Carvão",
    "Acessórios"
];

export default function StockPage() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSaveProduct = (productData: any) => {
        if (editingProduct) {
            // Edit
            setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
        } else {
            // Add
            const newProduct = {
                ...productData,
                id: Math.random().toString(36).substr(2, 9)
            };
            setProducts([...products, newProduct]);
        }
        setIsModalOpen(false);
    };

    const handleImport = (items: { name: string; qty: number; category: string; price: number }[]) => {
        const newProducts = [...products];

        items.forEach(item => {
            // Check if product already exists (simple name match)
            const existingIndex = newProducts.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());

            if (existingIndex >= 0) {
                // Update stock
                newProducts[existingIndex] = {
                    ...newProducts[existingIndex],
                    stock: newProducts[existingIndex].stock + item.qty
                };
            } else {
                // Create new product
                newProducts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    stock: item.qty,
                    minStock: 5 // Default min stock
                });
            }
        });

        setProducts(newProducts);
    };

    const handleAddCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    const handleRemoveCategory = (category: string) => {
        if (confirm(`Deseja remover a categoria "${category}"?`)) {
            setCategories(categories.filter(c => c !== category));
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">

            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Gestão de Estoque</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        title="Gerenciar Categorias"
                    >
                        <Layers size={20} />
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-1"></div>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10"
                    >
                        <Upload size={20} />
                        <span className="hidden md:inline">Importar Lista</span>
                    </button>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Novo Produto</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

                {/* Stats / Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 text-sm text-zinc-400">
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            Total: <span className="text-white font-bold">{products.length}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                            Esgotados: <span className="font-bold">{products.filter(p => p.stock === 0).length}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <StockTable
                    products={filteredProducts}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />

            </main>

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={editingProduct}
                categories={categories}
            />

            {/* Import Modal */}
            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                categories={categories}
            />

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
            />

        </div>
    );
}
