import { X, ArrowRight, Upload, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ParsedItem {
    originalLine: string;
    name: string;
    qty: number;
    isValid: boolean;
}

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (items: { name: string; qty: number; category: string; price: number }[]) => void;
    categories: string[];
}

export default function BulkImportModal({ isOpen, onClose, onImport, categories }: BulkImportModalProps) {
    const [text, setText] = useState("");
    const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
    const [step, setStep] = useState<"input" | "preview">("input");

    // Default values for new items
    const [defaultCategory, setDefaultCategory] = useState(categories[0] || "Pod Descartável");
    const [defaultPrice, setDefaultPrice] = useState("0");

    useEffect(() => {
        if (isOpen) {
            setText("");
            setParsedItems([]);
            setStep("input");
            if (categories.length > 0) setDefaultCategory(categories[0]);
        }
    }, [isOpen, categories]);

    const parseText = () => {
        const lines = text.split("\n").filter(line => line.trim() !== "");
        const items: ParsedItem[] = [];
        let currentGroup = "";

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Check if line starts with a number (Quantity)
            const match = trimmedLine.match(/^(\d+)\s+(.+)$/);

            if (match) {
                // It's an item: "1 icy mint"
                const qty = parseInt(match[1]);
                const variantName = match[2].toUpperCase(); // Convert flavor to UPPERCASE
                const fullName = currentGroup ? `${currentGroup} ${variantName}` : variantName;

                items.push({
                    originalLine: line,
                    name: fullName,
                    qty: qty,
                    isValid: true
                });
            } else {
                // It's a group header: "V80"
                currentGroup = trimmedLine;
                // We don't add this as an item, just update the context
            }
        });

        setParsedItems(items);
        setStep("preview");
    };

    const handleConfirm = () => {
        const importData = parsedItems
            .filter(item => item.isValid)
            .map(item => ({
                name: item.name,
                qty: item.qty,
                category: defaultCategory,
                price: Number(defaultPrice)
            }));

        onImport(importData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Upload size={20} className="text-blue-400" />
                        Importação em Massa
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {step === "input" ? (
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200 flex gap-3">
                                <AlertCircle size={20} className="shrink-0 text-blue-400" />
                                <div>
                                    <p className="font-bold mb-1">Como funciona:</p>
                                    <p>Cole sua lista abaixo. Linhas com números serão tratadas como quantidade. Linhas sem números serão usadas como prefixo para os itens abaixo.</p>
                                    <pre className="mt-2 bg-black/20 p-2 rounded text-xs text-zinc-400 font-mono">
                                        V80{'\n'}
                                        1 icy mint{'\n'}
                                        2 mentol
                                    </pre>
                                </div>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none placeholder-zinc-600"
                                placeholder="Cole sua lista aqui..."
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-400 uppercase">Categoria Padrão</label>
                                    <select
                                        value={defaultCategory}
                                        onChange={(e) => setDefaultCategory(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-400 uppercase">Preço Padrão (R$)</label>
                                    <input
                                        type="number"
                                        value={defaultPrice}
                                        onChange={(e) => setDefaultPrice(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-medium">Pré-visualização ({parsedItems.length} itens)</h3>
                                <button
                                    onClick={() => setStep("input")}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                    Editar texto
                                </button>
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-zinc-400 font-medium">
                                        <tr>
                                            <th className="p-3">Produto Identificado</th>
                                            <th className="p-3 text-center">Qtd</th>
                                            <th className="p-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {parsedItems.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-white/5">
                                                <td className="p-3 text-white">{item.name}</td>
                                                <td className="p-3 text-center font-mono text-zinc-300">{item.qty}</td>
                                                <td className="p-3 text-right">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        Pronto
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all font-medium"
                    >
                        Cancelar
                    </button>

                    {step === "input" ? (
                        <button
                            onClick={parseText}
                            disabled={!text.trim()}
                            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Processar <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                        >
                            <Upload size={18} /> Importar Itens
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
