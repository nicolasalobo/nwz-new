"use client";

import { Trash2, ShoppingCart, User, Users, Share2, Tag, CreditCard, Banknote, Clock, Gift } from "lucide-react";
import { useState, useEffect } from "react";

interface CartItem {
    id: string;
    productId: string;
    name: string;
    variant: string;
    price: number;
}

interface CartProps {
    items: CartItem[];
    onRemove: (id: string) => void;
    onCheckout: (data: any) => void;
    role?: "admin" | "partner" | "affiliate";
}

import { CLIENTS } from "@/app/data/mock";

export default function Cart({ items, onRemove, onCheckout, role = "admin" }: CartProps) {
    const [customerType, setCustomerType] = useState<"client" | "partner" | "affiliate">("client");
    const [selectedRoleUser, setSelectedRoleUser] = useState("");
    const [clientName, setClientName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "credit">("pix");
    const [isNewClient, setIsNewClient] = useState(false);

    // Admin: Custom Price
    const [isCustomPrice, setIsCustomPrice] = useState(false);
    const [customPriceValue, setCustomPriceValue] = useState("");
    const [customPriceReason, setCustomPriceReason] = useState("");

    // Partner: Coupon
    const [couponCode, setCouponCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);

    // Reset state when role changes
    useEffect(() => {
        setCustomerType("client");
        setSelectedRoleUser("");
        setIsCustomPrice(false);
        setCustomPriceValue("");
        setCustomPriceReason("");
        setCouponCode("");
        setDiscountPercent(0);
        setPaymentMethod("pix");
        setIsNewClient(false);
        setClientName("");
    }, [role]);

    // Coupon Logic
    useEffect(() => {
        if (couponCode.toUpperCase() === "NWZ10") {
            setDiscountPercent(10);
        } else {
            setDiscountPercent(0);
        }
    }, [couponCode]);

    // Mock Users for Dropdown
    const PARTNERS = ["João Silva", "Maria Oliveira", "Pedro Santos"];
    const AFFILIATES_DATA = {
        "Curitipods": ["Alvaro", "Play"],
        "Maripods": ["Jumble"]
    };
    const AFFILIATES = Object.keys(AFFILIATES_DATA);

    const [benefitType, setBenefitType] = useState<"commission" | "unit">("commission");
    const [selectedSeller, setSelectedSeller] = useState("");

    useEffect(() => {
        setSelectedSeller("");
    }, [selectedRoleUser]);

    // Calculate Totals
    const subtotal = items.reduce((acc, item) => acc + item.price, 0);

    let total = subtotal;
    let discountAmount = 0;

    // Admin Custom Price Logic
    if (role === "admin" && isCustomPrice && customPriceValue) {
        total = parseFloat(customPriceValue);
    }
    // Affiliate Coupon Logic (Partners use Benefit Type now, no cart discount)
    else if (role === "affiliate" && discountPercent > 0) {
        discountAmount = (subtotal * discountPercent) / 100;
        total = subtotal - discountAmount;
    }

    const handleCheckout = () => {
        const status = paymentMethod === "credit" ? "open" : "paid";

        onCheckout({
            items,
            customerType: role === "partner" || role === "affiliate" ? "client" : customerType,
            selectedRoleUser: role === "affiliate" ? `${selectedRoleUser} - ${selectedSeller}` : selectedRoleUser,
            clientName,
            total,
            isCustomPrice,
            customPriceReason,
            // Pass the benefit type for partners
            benefitType: role === "partner" ? benefitType : null,
            discountAmount,
            paymentMethod: paymentMethod === "credit" ? "A Prazo" : paymentMethod === "credit_card" ? "Cartão de Crédito" : "Pix",
            status
        });
    };

    const selectedClientDebt = !isNewClient ? (CLIENTS.find(c => c.name === clientName)?.totalDebt || 0) : 0;

    const isCheckoutDisabled =
        items.length === 0 ||
        (role === "admin" && isCustomPrice && (!customPriceValue || !customPriceReason)) ||
        !clientName.trim() ||
        selectedClientDebt > 0 || // Block if debt exists (only for existing clients)
        (role === "admin" && customerType !== "client" && !selectedRoleUser) ||
        (role === "affiliate" && (!selectedRoleUser || !selectedSeller));

    return (
        <div className="bg-[#0B1121] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full">

            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                <ShoppingCart className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">Carrinho</h2>
                <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {items.length}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                {/* Partner Benefit Selector */}
                {role === "partner" && (
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Gift size={14} />
                            Escolha seu Benefício
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setBenefitType("commission")}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${benefitType === "commission"
                                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                    : "bg-black/20 border-transparent text-zinc-500 hover:bg-white/5"
                                    }`}
                            >
                                <span className="font-bold text-sm">Comissão (10%)</span>
                                <span className="text-[10px] opacity-70">Ganhar R$ {(subtotal * 0.1).toFixed(2)}</span>
                            </button>
                            <button
                                onClick={() => setBenefitType("unit")}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${benefitType === "unit"
                                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                                    : "bg-black/20 border-transparent text-zinc-500 hover:bg-white/5"
                                    }`}
                            >
                                <span className="font-bold text-sm">Contar Brinde</span>
                                <span className="text-[10px] opacity-70">+1 na meta de 10</span>
                            </button>
                        </div>
                    </div>
                )}
                {role === "admin" && (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo de Venda</label>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setCustomerType("client")}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${customerType === "client"
                                    ? "bg-blue-600/20 border-blue-600 text-blue-400"
                                    : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                    }`}
                            >
                                <User size={20} />
                                <span className="text-xs font-bold">Cliente</span>
                            </button>
                            <button
                                onClick={() => setCustomerType("partner")}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${customerType === "partner"
                                    ? "bg-emerald-600/20 border-emerald-600 text-emerald-400"
                                    : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                    }`}
                            >
                                <Users size={20} />
                                <span className="text-xs font-bold">Parceiro</span>
                            </button>
                            <button
                                onClick={() => setCustomerType("affiliate")}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${customerType === "affiliate"
                                    ? "bg-purple-600/20 border-purple-600 text-purple-400"
                                    : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                    }`}
                            >
                                <Share2 size={20} />
                                <span className="text-xs font-bold">Afiliado</span>
                            </button>
                        </div>

                        {/* Dropdown for Partner/Affiliate */}
                        {customerType !== "client" && (
                            <div className="space-y-2">
                                <select
                                    value={selectedRoleUser}
                                    onChange={(e) => setSelectedRoleUser(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors animate-in fade-in slide-in-from-top-2"
                                >
                                    <option value="">Selecione o {customerType === "partner" ? "Parceiro" : "Afiliado"}...</option>
                                    {customerType === "partner"
                                        ? PARTNERS.map(p => <option key={p} value={p}>{p}</option>)
                                        : AFFILIATES.map(a => <option key={a} value={a}>{a}</option>)
                                    }
                                </select>

                                {/* Seller Dropdown for Affiliate */}
                                {customerType === "affiliate" && selectedRoleUser && (
                                    <select
                                        value={selectedSeller}
                                        onChange={(e) => setSelectedSeller(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors animate-in fade-in slide-in-from-top-2"
                                    >
                                        <option value="">Selecione o Vendedor...</option>
                                        {AFFILIATES_DATA[selectedRoleUser as keyof typeof AFFILIATES_DATA]?.map(seller => (
                                            <option key={seller} value={seller}>{seller}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Affiliate Mode (Not Admin) */}
                {role === "affiliate" && (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Identificação do Afiliado</label>
                        <div className="space-y-2">
                            <select
                                value={selectedRoleUser}
                                onChange={(e) => setSelectedRoleUser(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">Selecione o Afiliado...</option>
                                {AFFILIATES.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>

                            {selectedRoleUser && (
                                <select
                                    value={selectedSeller}
                                    onChange={(e) => setSelectedSeller(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors animate-in fade-in slide-in-from-top-2"
                                >
                                    <option value="">Selecione o Vendedor...</option>
                                    {AFFILIATES_DATA[selectedRoleUser as keyof typeof AFFILIATES_DATA]?.map(seller => (
                                        <option key={seller} value={seller}>{seller}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                )}

                {/* Client Selection (Always Visible) */}
                <div className={role === "admin" ? "pt-2" : ""}>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cliente Final</label>
                        <button
                            onClick={() => {
                                setIsNewClient(!isNewClient);
                                setClientName("");
                            }}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {isNewClient ? "Selecionar Existente" : "+ Novo Cliente"}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {isNewClient ? (
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Nome do Novo Cliente"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 animate-in fade-in"
                                autoFocus
                            />
                        ) : (
                            <select
                                value={clientName}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setClientName(name);
                                    // Check debt
                                    const client = CLIENTS.find(c => c.name === name);
                                    if (client && client.totalDebt > 0) {
                                        // Logic handled in render for blocking
                                    }
                                }}
                                className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none transition-colors ${CLIENTS.find(c => c.name === clientName)?.totalDebt ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'
                                    }`}
                            >
                                <option value="">Selecione o Cliente...</option>
                                {CLIENTS.map(client => (
                                    <option key={client.id} value={client.name}>
                                        {client.name} {client.totalDebt > 0 ? `(Dívida: R$ ${client.totalDebt.toFixed(2)})` : ""}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Debt Warning (Only for Existing Clients) */}
                        {!isNewClient && CLIENTS.find(c => c.name === clientName)?.totalDebt ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <div className="p-2 bg-red-500/20 rounded-full text-red-400">
                                    <Banknote size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-red-400">Venda Bloqueada</p>
                                    <p className="text-xs text-red-300/80">
                                        Cliente possui débitos pendentes de R$ {CLIENTS.find(c => c.name === clientName)?.totalDebt.toFixed(2)}.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Itens</label>
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-zinc-600 border-2 border-dashed border-white/5 rounded-xl">
                            Carrinho vazio
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-sm font-bold text-white">{item.name}</p>
                                        <p className="text-xs text-zinc-400">{item.variant}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-emerald-400">R$ {item.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="text-zinc-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Forma de Pagamento</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setPaymentMethod("pix")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "pix"
                                ? "bg-emerald-600/20 border-emerald-600 text-emerald-400"
                                : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                }`}
                        >
                            <Banknote size={20} />
                            <span className="text-xs font-bold">Pix</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("credit_card")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "credit_card"
                                ? "bg-blue-600/20 border-blue-600 text-blue-400"
                                : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                }`}
                        >
                            <CreditCard size={20} />
                            <span className="text-xs font-bold">Cartão</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("credit")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "credit"
                                ? "bg-amber-600/20 border-amber-600 text-amber-400"
                                : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10"
                                }`}
                        >
                            <Clock size={20} />
                            <span className="text-xs font-bold">A Prazo</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4 pt-4 border-t border-white/10">

                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="text-white font-bold">R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {/* Affiliate: Coupon Input */}
                    {role === "affiliate" && (
                        <div className="bg-white/5 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2 text-purple-400 mb-2">
                                <Tag size={16} />
                                <span className="text-sm font-bold">Cupom de Desconto</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Código do Cupom"
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm uppercase placeholder:normal-case"
                                />
                            </div>
                            {discountPercent > 0 && (
                                <p className="text-xs text-emerald-400 font-medium animate-in fade-in">
                                    Cupom aplicado: {discountPercent}% de desconto!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Admin: Custom Price Toggle */}
                    {role === "admin" && (
                        <div className="bg-white/5 rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-amber-400">Preço Personalizado</span>
                                <button
                                    onClick={() => setIsCustomPrice(!isCustomPrice)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${isCustomPrice ? 'bg-amber-500' : 'bg-zinc-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isCustomPrice ? 'left-5' : 'left-1'}`} />
                                </button>
                            </div>

                            {isCustomPrice && (
                                <div className="space-y-3 animate-in slide-in-from-top-2">
                                    <div>
                                        <label className="text-xs text-zinc-500 mb-1 block">Novo Valor Total</label>
                                        <input
                                            type="number"
                                            value={customPriceValue}
                                            onChange={(e) => setCustomPriceValue(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 mb-1 block">Motivo (Obrigatório)</label>
                                        <textarea
                                            value={customPriceReason}
                                            onChange={(e) => setCustomPriceReason(e.target.value)}
                                            placeholder="Ex: Desconto fidelidade..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm h-20 resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Discount Display */}
                    {discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm text-emerald-400">
                            <span>Desconto</span>
                            <span>- R$ {discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between text-xl font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-emerald-400">R$ {total.toFixed(2)}</span>
                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
                <button
                    onClick={handleCheckout}
                    disabled={isCheckoutDisabled}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Finalizar Venda
                </button>
            </div>

        </div>
    );
}
