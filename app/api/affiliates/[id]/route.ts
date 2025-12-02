import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, store, commission, sellers, status } = body;

        const affiliate = await prisma.affiliateSeller.update({
            where: { id },
            data: {
                name,
                storeName: store,
                commission: Number(commission),
                sellers,
                status,
            },
        });

        return NextResponse.json(affiliate);
    } catch (error) {
        console.error('Error updating affiliate:', error);
        return NextResponse.json(
            { error: 'Error updating affiliate' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.affiliateSeller.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting affiliate:', error);
        return NextResponse.json(
            { error: 'Error deleting affiliate' },
            { status: 500 }
        );
    }
}
