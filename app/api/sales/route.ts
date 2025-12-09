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

        let whereClause = {};

        if (role === 'admin') {
            // No filter
        } else if (role === 'partner') {
            whereClause = { userId: userId };
        } else if (role === 'affiliate') {
            const affiliateProfile = await prisma.affiliateSeller.findFirst({
                where: { userId: userId }
            });
            if (!affiliateProfile) {
                return NextResponse.json([]);
            }
            whereClause = { affiliateSellerId: affiliateProfile.id };
        } else {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const sales = await prisma.sale.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                client: true,
                user: true,
            },
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json(
            { error: 'Error fetching sales' },
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
        const {
            items,
            paymentMethod,
            discount,
            clientId,
            clientName, // Add this
            affiliateSellerId,
            amountPaid, // For partial payments
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items in sale' }, { status: 400 });
        }

        // Resolve Client
        let finalClientId = clientId;
        if (!finalClientId && clientName) {
            // Check if client exists by name
            const existingClient = await prisma.client.findFirst({
                where: { name: { equals: clientName, mode: 'insensitive' } }
            });

            if (existingClient) {
                finalClientId = existingClient.id;
            } else {
                // Create new client
                const newClient = await prisma.client.create({
                    data: { name: clientName }
                });
                finalClientId = newClient.id;
            }
        }

        // Calculate totals
        let subtotal = 0;
        const saleItemsData: { productId: string; quantity: number; price: number; total: number }[] = [];

        // Verify stock and calculate totals
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 400 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for: ${product.name}` },
                    { status: 400 }
                );
            }

            const itemTotal = item.price * item.quantity; // Use price from request (allows custom prices)
            subtotal += itemTotal;

            saleItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal,
            });
        }

        const total = subtotal - (discount || 0);

        // Determine status based on payment
        let status = 'pending';
        const paid = Number(amountPaid) || 0;

        if (paid >= total) {
            status = 'completed'; // Fully paid
        } else if (paid === 0) {
            status = 'open'; // No payment yet
        } else {
            status = 'pending'; // Partial payment
        }

        // Transaction: Create Sale, Items, Update Stock, Update Client/Partner
        const sale = await prisma.$transaction(async (tx) => {
            // 1. Create Sale
            const newSale = await tx.sale.create({
                data: {
                    code: `#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Simple code generation
                    subtotal,
                    discount: Number(discount) || 0,
                    total,
                    paymentMethod,
                    amountPaid: paid,
                    status,
                    userId: session.id, // Who registered the sale
                    clientId: finalClientId,
                    affiliateSellerId: affiliateSellerId || null,
                    items: {
                        create: saleItemsData,
                    },
                },
                include: {
                    items: true,
                },
            });

            // 2. Update Stock
            for (const item of saleItemsData) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // 3. Update Client Stats (if applicable)
            if (finalClientId) {
                await tx.client.update({
                    where: { id: finalClientId },
                    data: {
                        totalPurchases: { increment: 1 },
                        totalSpent: { increment: total },
                        totalDebt: { increment: Math.max(0, total - paid) },
                        // totalUnits logic could be added here if needed for loyalty
                    },
                });
            }

            // 4. Update Partner/Affiliate Stats (if applicable)
            if (session.role === 'partner') {
                const partnerProfile = await tx.partnerProfile.findUnique({
                    where: { userId: session.id }
                });

                if (partnerProfile) {
                    const commissionAmount = (total * partnerProfile.commission) / 100;

                    await tx.partnerProfile.update({
                        where: { userId: session.id },
                        data: {
                            totalSales: { increment: total },
                            totalCommission: { increment: commissionAmount },
                            commissionBalance: { increment: commissionAmount },
                            unitsSold: { increment: items.reduce((acc: number, item: any) => acc + item.quantity, 0) },
                            unitProgress: { increment: items.reduce((acc: number, item: any) => acc + item.quantity, 0) }
                        }
                    });
                }
            }

            return newSale;
        });

        return NextResponse.json(sale);

    } catch (error) {
        console.error('Error creating sale:', error);
        return NextResponse.json(
            { error: 'Error processing sale' },
            { status: 500 }
        );
    }
}
