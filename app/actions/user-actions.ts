'use server'

export type UserRole = 'nwz' | 'parceiro' | 'afiliado';

export interface User {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    store?: string;
    createdAt: string;
}

// Mock database
let users: User[] = [
    {
        id: '1',
        name: 'Admin User',
        username: 'admin',
        role: 'nwz',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Parceiro Exemplo',
        username: 'parceiro',
        role: 'parceiro',
        store: 'Loja Centro',
        createdAt: new Date().toISOString(),
    }
];

export async function getUsers(): Promise<User[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return users;
}

export async function createUser(formData: FormData): Promise<{ success: boolean; message?: string; user?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as UserRole;
    const store = formData.get('store') as string;

    if (!name || !username || !password || !role) {
        return { success: false, message: 'Campos obrigatórios faltando.' };
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        return { success: false, message: 'Usuário já existe.' };
    }

    const newUser: User = {
        id: Math.random().toString(36).substring(7),
        name,
        username,
        role,
        store: store || undefined,
        createdAt: new Date().toISOString(),
    };

    users = [...users, newUser];

    return { success: true, user: newUser };
}

export async function deleteUser(userId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    users = users.filter(u => u.id !== userId);
    return { success: true };
}
