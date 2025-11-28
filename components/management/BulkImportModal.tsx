import { X, ArrowRight, Upload, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ParsedItem {
    originalLine: string;
    name: string;
    qty: number;
    isValid: boolean;
    group?: string;
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
    const [step, setStep] = useState<"input" | "pricing">("input");

    // Group Pricing State
    const [groupPrices, setGroupPrices] = useState<Record<string, string>>({}); // groupName -> costPrice
    const [detectedGroups, setDetectedGroups] = useState<string[]>([]);

    // Default values for new items (fallback)
    const [defaultCategory, setDefaultCategory] = useState(categories[0] || "Pod Descartável");

    useEffect(() => {
        if (isOpen) {
            setText("");
            setParsedItems([]);
            setStep("input");
            setGroupPrices({});
            setDetectedGroups([]);
            if (categories.length > 0) setDefaultCategory(categories[0]);
        }
    }, [isOpen, categories]);

    const calculateSellingPrice = (cost: number) => {
        if (!cost || isNaN(cost)) return 0;
        // Formula: Cost * 1.5, rounded up to next multiple of 5
        const withMargin = cost * 1.5;
        return Math.ceil(withMargin / 5) * 5;
    };

    const parseText = () => {
        const lines = text.split("\n").filter(line => line.trim() !== "");
        const items: ParsedItem[] = [];
        const groups = new Set<string>();
        let currentGroup = "Geral"; // Default group if none specified

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Check if line starts with a number (Quantity)
            // Matches "1 item" or "01 item"
            const match = trimmedLine.match(/^(\d+)\s+(.+)$/);

            if (match) {
                // It's an item: "1 icy mint"
                const qty = parseInt(match[1]);
                const variantName = match[2].toUpperCase(); // Convert flavor to UPPERCASE
                const fullName = currentGroup !== "Geral" ? `${currentGroup} ${variantName}` : variantName;

                items.push({
                    originalLine: line,
                    name: fullName,
                    qty: qty,
                    isValid: true,
                    group: currentGroup
                });
                groups.add(currentGroup);
            } else {
                // It's a group header: "V80"
                currentGroup = trimmedLine;
                // We don't add this as an item, just update the context
            }
        });

        setParsedItems(items);
        setDetectedGroups(Array.from(groups));
        setStep("pricing");
    };

    const handleConfirm = () => {
        const importData = parsedItems
            .filter(item => item.isValid)
            .map(item => {
                const cost = parseFloat(groupPrices[item.group || "Geral"] || "0");
                const sellingPrice = calculateSellingPrice(cost);

                return {
                    name: item.name,
                    qty: item.qty,
                    category: defaultCategory,
                    price: sellingPrice
                };
            });

        onImport(importData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Upload size={20} className="text-blue-400" />
                        Importação Inteligente
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
                                    <p>Cole sua lista abaixo. O sistema detectará os grupos (ex: v80) e os sabores.</p>
                                    <pre className="mt-2 bg-black/20 p-2 rounded text-xs text-zinc-400 font-mono">
                                        v80{'\n'}
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
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-medium">Definir Preços de Custo</h3>
                                <button
                                    onClick={() => setStep("input")}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                    Editar texto
                                </button>
                            </div>

                            {/* Pricing Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {detectedGroups.map(group => {
                                    const cost = parseFloat(groupPrices[group] || "0");
                                    const selling = calculateSellingPrice(cost);

                                    return (
                                        <div key={group} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="font-bold text-white border-b border-white/10 pb-2 mb-2">{group}</div>

                                            <div>
                                                <label className="text-xs text-zinc-500 block mb-1">Preço de Custo (R$)</label>
                                                <input
                                                    type="number"
                                                    value={groupPrices[group] || ""}
                                                    onChange={(e) => setGroupPrices({ ...groupPrices, [group]: e.target.value })}
                                                    placeholder="0.00"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-xs text-zinc-500">Venda Sugerida:</span>
                                                <span className="text-emerald-400 font-bold text-lg">R$ {selling.toFixed(2)}</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-600 text-right">
                                                (Custo x 1.5 → Mult. 5)
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Preview Table */}
                            <div className="border border-white/10 rounded-xl overflow-hidden mt-6">
                                <div className="bg-white/5 px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    Pré-visualização dos Itens
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-black/20 text-zinc-500 font-medium sticky top-0">
                                            <tr>
                                                <th className="p-3">Produto</th>
                                                <th className="p-3 text-center">Qtd</th>
                                                <th className="p-3 text-right">Preço Venda</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {parsedItems.map((item, idx) => {
                                                const cost = parseFloat(groupPrices[item.group || "Geral"] || "0");
                                                const selling = calculateSellingPrice(cost);
                                                return (
                                                    <tr key={idx} className="hover:bg-white/5">
                                                        <td className="p-3 text-white">
                                                            <span className="text-zinc-500 text-xs mr-2">[{item.group}]</span>
                                                            {item.name}
                                                        </td>
                                                        <td className="p-3 text-center font-mono text-zinc-300">{item.qty}</td>
                                                        <td className="p-3 text-right font-bold text-emerald-400">
                                                            R$ {selling.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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
