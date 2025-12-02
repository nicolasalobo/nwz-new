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
        const { status, commissionBalance, unitProgress } = body;

        const partner = await prisma.partnerProfile.update({
            where: { id },
            data: {
                status,
                commissionBalance: commissionBalance !== undefined ? Number(commissionBalance) : undefined,
                unitProgress: unitProgress !== undefined ? Number(unitProgress) : undefined,
            },
        });

        return NextResponse.json(partner);
    } catch (error) {
        console.error('Error updating partner:', error);
        return NextResponse.json(
            { error: 'Error updating partner' },
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

        // Instead of hard delete, we might want to deactivate, but for now let's delete the profile
        // Note: This won't delete the User, only the PartnerProfile
        await prisma.partnerProfile.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting partner:', error);
        return NextResponse.json(
            { error: 'Error deleting partner' },
            { status: 500 }
        );
    }
}
