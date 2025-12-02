import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const affiliates = await prisma.affiliateSeller.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(affiliates);
    } catch (error) {
        console.error('Error fetching affiliates:', error);
        return NextResponse.json(
            { error: 'Error fetching affiliates' },
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
        const { name, store, commission, sellers } = body;

        if (!name || !store) {
            return NextResponse.json(
                { error: 'Name and Store are required' },
                { status: 400 }
            );
        }

        const affiliate = await prisma.affiliateSeller.create({
            data: {
                name,
                storeName: store,
                commission: Number(commission) || 0,
                sellers: sellers || [], // Array of strings
                status: 'active',
                userId: session.id,
            },
        });

        return NextResponse.json(affiliate);
    } catch (error) {
        console.error('Error creating affiliate:', error);
        return NextResponse.json(
            { error: 'Error creating affiliate' },
            { status: 500 }
        );
    }
}
