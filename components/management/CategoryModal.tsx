import { X, Plus, Trash2, Layers } from "lucide-react";
import { useState } from "react";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    onAddCategory: (category: string) => void;
    onRemoveCategory: (category: string) => void;
}

export default function CategoryModal({ isOpen, onClose, categories, onAddCategory, onRemoveCategory }: CategoryModalProps) {
    const [newCategory, setNewCategory] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={20} className="text-purple-400" />
                        Gerenciar Categorias
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Add New */}
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nova categoria..."
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newCategory.trim()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </form>

                    {/* List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                                <span className="text-white font-medium">{category}</span>
                                <button
                                    onClick={() => onRemoveCategory(category)}
                                    className="text-zinc-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remover"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-center text-zinc-500 py-4 text-sm">Nenhuma categoria cadastrada.</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
