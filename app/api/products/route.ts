import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produtos.' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Acesso negado.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, category, price, costPrice, stock, minStock, image } = body;

        if (!name || !category || price === undefined || stock === undefined) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando.' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                category,
                price: Number(price),
                costPrice: Number(costPrice || 0),
                stock: Number(stock),
                minStock: Number(minStock || 5),
                image,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Erro ao criar produto.' },
            { status: 500 }
        );
    }
}
