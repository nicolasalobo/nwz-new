"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import PartnerDashboard from "@/components/dashboard/PartnerDashboard";
import AffiliateDashboard from "@/components/dashboard/AffiliateDashboard";

export default function DashboardPage() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setRole(data.user.role);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {role === "admin" && <AdminDashboard />}
            {role === "partner" && <PartnerDashboard />}
            {role === "affiliate" && <AffiliateDashboard />}
        </div>
    );
}
