import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.role;
        const userId = session.id;

        // --- ADMIN LOGIC ---
        if (role === 'admin') {
            // 1. Total Revenue (Sum of all completed sales)
            const totalRevenueAgg = await prisma.sale.aggregate({
                _sum: { total: true },
                where: { status: 'completed' },
            });
            const totalRevenue = totalRevenueAgg._sum.total || 0;

            // 2. Total Sales Count (All time)
            const totalSalesCount = await prisma.sale.count();

            // 3. Active Partners Count
            const activePartnersCount = await prisma.partnerProfile.count({
                where: { status: 'active' },
            });

            // 4. Active Affiliates Count
            const activeAffiliatesCount = await prisma.affiliateSeller.count({
                where: { status: 'active' },
            });

            // 5. Recent Sales (Limit 5)
            const recentSales = await prisma.sale.findMany({
                take: 5,
                orderBy: { date: 'desc' },
                include: {
                    client: { select: { name: true } },
                },
            });

            const formattedRecentSales = recentSales.map(sale => ({
                id: sale.id,
                customer: sale.client?.name || 'Cliente Desconhecido',
                amount: sale.total,
                status: sale.status,
                date: sale.date,
            }));

            // 6. Sales by Day (Last 7 Days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const salesLast7Days = await prisma.sale.groupBy({
                by: ['date'],
                _sum: { total: true },
                where: {
                    date: { gte: sevenDaysAgo },
                    status: 'completed',
                },
            });

            const salesByDay = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });

                const salesForDay = salesLast7Days.filter(s => s.date.toISOString().split('T')[0] === dateStr);
                const total = salesForDay.reduce((acc, curr) => acc + (curr._sum.total || 0), 0);

                return { day: dayName.charAt(0).toUpperCase() + dayName.slice(1), total };
            });

            return NextResponse.json({
                totalRevenue,
                totalSalesCount,
                activePartnersCount,
                activeAffiliatesCount,
                recentSales: formattedRecentSales,
                salesByDay,
            });
        }

        // --- PARTNER LOGIC ---
        if (role === 'partner') {
            // 1. Total Revenue (Sum of sales where userId matches)
            // Note: Assuming 'partner' sales are linked via userId directly or via PartnerProfile logic.
            // Based on schema: Sale has userId. If partner makes a sale, it might be linked there.
            // Or if they are managing clients, maybe linked via client?
            // Let's assume for now sales linked to the user directly are theirs.

            const totalRevenueAgg = await prisma.sale.aggregate({
                _sum: { total: true },
                where: {
                    userId: userId,
                    status: 'completed'
                },
            });
            const totalRevenue = totalRevenueAgg._sum.total || 0;

            // 2. Total Sales Count
            const totalSalesCount = await prisma.sale.count({
                where: { userId: userId }
            });

            // 3. Recent Sales
            const recentSales = await prisma.sale.findMany({
                take: 5,
                where: { userId: userId },
                orderBy: { date: 'desc' },
                include: {
                    client: { select: { name: true } },
                },
            });

            const formattedRecentSales = recentSales.map(sale => ({
                id: sale.id,
                customer: sale.client?.name || 'Cliente Desconhecido',
                amount: sale.total,
                status: sale.status,
                date: sale.date,
            }));

            return NextResponse.json({
                totalRevenue,
                totalSalesCount,
                recentSales: formattedRecentSales,
            });
        }

        // --- AFFILIATE LOGIC ---
        if (role === 'affiliate') {
            // Need to find the AffiliateSeller record for this user first
            const affiliateProfile = await prisma.affiliateSeller.findFirst({
                where: { userId: userId }
            });

            if (!affiliateProfile) {
                return NextResponse.json({
                    totalRevenue: 0,
                    totalSalesCount: 0,
                    recentSales: [],
                });
            }

            // 1. Total Revenue
            const totalRevenueAgg = await prisma.sale.aggregate({
                _sum: { total: true },
                where: {
                    affiliateSellerId: affiliateProfile.id,
                    status: 'completed'
                },
            });
            const totalRevenue = totalRevenueAgg._sum.total || 0;

            // 2. Total Sales Count
            const totalSalesCount = await prisma.sale.count({
                where: { affiliateSellerId: affiliateProfile.id }
            });

            // 3. Recent Sales
            const recentSales = await prisma.sale.findMany({
                take: 5,
                where: { affiliateSellerId: affiliateProfile.id },
                orderBy: { date: 'desc' },
                include: {
                    client: { select: { name: true } },
                },
            });

            const formattedRecentSales = recentSales.map(sale => ({
                id: sale.id,
                customer: sale.client?.name || 'Cliente Desconhecido',
                amount: sale.total,
                status: sale.status,
                date: sale.date,
            }));

            return NextResponse.json({
                totalRevenue,
                totalSalesCount,
                recentSales: formattedRecentSales,
            });
        }

        return NextResponse.json({ error: 'Role not supported' }, { status: 403 });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Error fetching dashboard stats' },
            { status: 500 }
        );
    }
}
