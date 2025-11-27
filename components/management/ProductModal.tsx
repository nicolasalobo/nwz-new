import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    image?: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, "id"> | Product) => void;
    productToEdit?: Product | null;
    categories: string[];
}

export default function ProductModal({ isOpen, onClose, onSave, productToEdit, categories }: ProductModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        minStock: ""
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                price: productToEdit.price.toString(),
                stock: productToEdit.stock.toString(),
                minStock: productToEdit.minStock.toString()
            });
        } else {
            setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                minStock: ""
            });
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...productToEdit,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            stock: Number(formData.stock),
            minStock: Number(formData.minStock)
        } as Product);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white">
                        {productToEdit ? "Editar Produto" : "Novo Produto"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 uppercase">Nome do Produto</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="Ex: Pod Descartável"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 uppercase">Categoria</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none"
                        >
                            <option value="" disabled>Selecione uma categoria</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Price */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Stock */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Estoque Atual</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Min Stock */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 uppercase">Estoque Mínimo (Alerta)</label>
                        <input
                            type="number"
                            required
                            value={formData.minStock}
                            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="Ex: 10"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                        >
                            Salvar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
