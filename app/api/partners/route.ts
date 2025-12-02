import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const partners = await prisma.partnerProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });

        // Flatten the response for easier frontend consumption
        const formattedPartners = partners.map(partner => ({
            id: partner.id,
            userId: partner.userId,
            name: partner.user.name,
            email: partner.user.username,
            commissionBalance: partner.commissionBalance,
            unitProgress: partner.unitProgress,
            totalSales: partner.totalSales,
            status: partner.status,
        }));

        return NextResponse.json(formattedPartners);
    } catch (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json(
            { error: 'Error fetching partners' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Check if partner profile already exists
        const existingPartner = await prisma.partnerProfile.findUnique({
            where: { userId },
        });

        if (existingPartner) {
            return NextResponse.json(
                { error: 'User is already a partner' },
                { status: 400 }
            );
        }

        const partner = await prisma.partnerProfile.create({
            data: {
                userId,
                status: 'active',
                commissionBalance: 0,
                unitProgress: 0,
                totalSales: 0,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json({
            id: partner.id,
            userId: partner.userId,
            name: partner.user.name,
            email: partner.user.username,
            commissionBalance: partner.commissionBalance,
            unitProgress: partner.unitProgress,
            totalSales: partner.totalSales,
            status: partner.status,
        });

    } catch (error) {
        console.error('Error creating partner:', error);
        return NextResponse.json(
            { error: 'Error creating partner' },
            { status: 500 }
        );
    }
}
