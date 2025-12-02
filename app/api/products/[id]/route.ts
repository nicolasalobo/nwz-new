import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Acesso negado.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { name, category, price, costPrice, stock, minStock, image } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                price: Number(price),
                costPrice: Number(costPrice),
                stock: Number(stock),
                minStock: Number(minStock),
                image,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar produto.' },
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

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Acesso negado.' },
                { status: 403 }
            );
        }

        const { id } = await params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir produto.' },
            { status: 500 }
        );
    }
}
