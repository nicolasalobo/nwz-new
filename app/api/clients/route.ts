import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Error fetching clients' },
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

        const data = await request.json();
        const { name, phone, email, address } = data;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newClient = await prisma.client.create({
            data: {
                name,
                phone: phone || '',
                totalDebt: 0,
                totalPurchases: 0,
                totalUnits: 0,
            },
        });

        return NextResponse.json(newClient);
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Error creating client' },
            { status: 500 }
        );
    }
}
