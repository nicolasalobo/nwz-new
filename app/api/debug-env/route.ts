
import { NextResponse } from 'next/server';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
    // Mask password
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

    return NextResponse.json({
        databaseUrl: maskedUrl,
        nodeEnv: process.env.NODE_ENV,
        directUrlSet: !!process.env.DIRECT_URL,
    });
}
