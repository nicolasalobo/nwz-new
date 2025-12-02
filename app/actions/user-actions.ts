'use server'

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export type UserRole = 'nwz' | 'parceiro' | 'afiliado';

export interface User {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    store?: string;
    createdAt: string;
}

// Helper to map DB role to UI role
function mapDbRoleToUi(role: string): UserRole {
    if (role === 'admin') return 'nwz';
    if (role === 'partner') return 'parceiro';
    if (role === 'affiliate') return 'afiliado';
    return 'parceiro'; // Fallback
}

// Helper to map UI role to DB role
function mapUiRoleToDb(role: UserRole): string {
    if (role === 'nwz') return 'admin';
    if (role === 'parceiro') return 'partner';
    if (role === 'afiliado') return 'affiliate';
    return 'partner';
}

export async function getUsers(): Promise<User[]> {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return [];
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            affiliateSellers: true,
        }
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        role: mapDbRoleToUi(u.role),
        store: u.affiliateSellers[0]?.storeName || undefined,
        createdAt: u.createdAt.toISOString(),
    }));
}

export async function createUser(formData: FormData): Promise<{ success: boolean; message?: string; user?: User }> {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return { success: false, message: 'Não autorizado.' };
    }

    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const roleUi = formData.get('role') as UserRole;
    const store = formData.get('store') as string;

    if (!name || !username || !password || !roleUi) {
        return { success: false, message: 'Campos obrigatórios faltando.' };
    }

    const roleDb = mapUiRoleToDb(roleUi);

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
        where: { username }
    });

    if (existingUser) {
        return { success: false, message: 'Usuário já existe.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    username,
                    password: hashedPassword,
                    role: roleDb,
                }
            });

            if (roleDb === 'partner') {
                await tx.partnerProfile.create({
                    data: {
                        userId: user.id,
                    }
                });
            } else if (roleDb === 'affiliate') {
                await tx.affiliateSeller.create({
                    data: {
                        userId: user.id,
                        name: user.name,
                        storeName: store || null,
                    }
                });
            }

            return user;
        });

        return {
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                role: roleUi,
                store: store || undefined,
                createdAt: newUser.createdAt.toISOString(),
            }
        };

    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Erro ao criar usuário no banco de dados.' };
    }
}

export async function deleteUser(userId: string): Promise<{ success: boolean }> {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return { success: false };
    }

    try {
        // Delete related records first (cascade should handle this but let's be safe if not configured)
        // Actually Prisma schema handles relations, but we need to be careful.
        // The schema doesn't specify onDelete: Cascade explicitly for all relations, 
        // but let's assume standard deletion or rely on Prisma to throw if constraint fails.
        // We should probably delete profile/affiliate first.

        await prisma.$transaction(async (tx) => {
            await tx.partnerProfile.deleteMany({ where: { userId } });
            await tx.affiliateSeller.deleteMany({ where: { userId } });
            await tx.sale.updateMany({ where: { userId }, data: { userId: null } }); // Detach sales? Or delete?
            // Actually, deleting a user might be dangerous if they have sales.
            // For now, let's just try to delete the user. If it fails due to FK, we catch it.
            // But wait, the seed file deletes everything.
            // Let's try to delete the user.

            await tx.user.delete({ where: { id: userId } });
        });

        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false };
    }
}
