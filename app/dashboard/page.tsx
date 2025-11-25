"use client";

import { useState } from "react";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import PartnerDashboard from "@/components/dashboard/PartnerDashboard";
import AffiliateDashboard from "@/components/dashboard/AffiliateDashboard";

export default function DashboardPage() {
    const [role, setRole] = useState<"admin" | "partner" | "affiliate">("admin");

    return (
        <div className="relative">
            {/* Role Switcher (Demo Only) */}
            <div className="fixed bottom-4 right-4 z-[60] flex bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full p-1 shadow-2xl">
                <button
                    onClick={() => setRole("admin")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "admin" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Admin
                </button>
                <button
                    onClick={() => setRole("partner")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "partner" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Parceiro
                </button>
                <button
                    onClick={() => setRole("affiliate")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${role === "affiliate" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Afiliado
                </button>
            </div>

            {role === "admin" ? <AdminDashboard /> :
                role === "partner" ? <PartnerDashboard /> :
                    <AffiliateDashboard />}
        </div>
    );
}
