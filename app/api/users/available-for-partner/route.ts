import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch users who do NOT have a partner profile
        const users = await prisma.user.findMany({
            where: {
                partnerProfile: null,
                role: { not: 'admin' } // Optional: exclude admins if they shouldn't be partners
            },
            select: {
                id: true,
                name: true,
                username: true,
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching available users:', error);
        return NextResponse.json(
            { error: 'Error fetching users' },
            { status: 500 }
        );
    }
}
