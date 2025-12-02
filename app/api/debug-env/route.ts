import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

    let connectionStatus = 'PENDING';
    let userCount = null;
    let errorDetail = null;

    try {
        userCount = await prisma.user.count();
        connectionStatus = 'SUCCESS';
    } catch (e: any) {
        connectionStatus = 'FAILED';
        errorDetail = e.message;
    }

    return NextResponse.json({
        databaseUrl: maskedUrl,
        nodeEnv: process.env.NODE_ENV,
        directUrlSet: !!process.env.DIRECT_URL,
        connectionTest: {
            status: connectionStatus,
            usersFound: userCount,
            error: errorDetail
        }
    });
}
