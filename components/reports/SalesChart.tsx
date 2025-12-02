interface SalesChartProps {
    data?: number[];
    labels?: string[];
}

export default function SalesChart({ data = [], labels = [] }: SalesChartProps) {
    // Default to empty if no data
    const chartData = data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
    const chartLabels = labels.length > 0 ? labels : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    const max = Math.max(...chartData) || 100;

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Vendas nos Últimos 7 Dias</h3>

            <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                {chartData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative flex items-end h-full">
                            <div
                                className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-blue-300 relative group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                style={{ height: `${(value / max) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    R$ {value.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-zinc-500 font-medium">{chartLabels[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
