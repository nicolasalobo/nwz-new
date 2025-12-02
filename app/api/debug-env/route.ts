import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
    const directUrl = process.env.DIRECT_URL || 'NOT_SET';

    const maskedDbUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    const maskedDirectUrl = directUrl.replace(/:([^:@]+)@/, ':****@');

    let poolerStatus = 'PENDING';
    let poolerError = null;

    let directStatus = 'PENDING';
    let directError = null;

    // Test Pooler (Standard Prisma Client)
    try {
        await prisma.user.count();
        poolerStatus = 'SUCCESS';
    } catch (e: any) {
        poolerStatus = 'FAILED';
        poolerError = e.message;
    }

    // Test Direct Connection
    const prismaDirect = new PrismaClient({
        datasources: {
            db: {
                url: directUrl,
            },
        },
    });

    try {
        await prismaDirect.user.count();
        directStatus = 'SUCCESS';
    } catch (e: any) {
        directStatus = 'FAILED';
        directError = e.message;
    } finally {
        await prismaDirect.$disconnect();
    }

    return NextResponse.json({
        nodeEnv: process.env.NODE_ENV,
        tests: {
            pooler: {
                url: maskedDbUrl,
                status: poolerStatus,
                error: poolerError
            },
            direct: {
                url: maskedDirectUrl,
                status: directStatus,
                error: directError
            }
        }
    });
}
