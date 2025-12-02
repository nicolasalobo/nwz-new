'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Shield, Store, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserForm from '@/components/admin/UserForm';
import { getUsers, deleteUser, User } from '@/app/actions/user-actions';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter(); // Import useRouter

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                if (data.user.role !== 'admin') {
                    router.push('/dashboard');
                    return;
                }
                loadUsers();
            } else {
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        }
    }

    async function loadUsers() {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
        setIsLoading(false);
    }

    async function handleDelete(userId: string) {
        if (confirm('Tem certeza que deseja remover este usuário?')) {
            await deleteUser(userId);
            loadUsers();
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4">
                            <ArrowLeft size={20} />
                            <span>Voltar para Dashboard</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-white">
                            Gestão de Usuários
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Gerencie contas, permissões e acessos do sistema.
                        </p>
                    </div>

                    {!isCreating && (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Novo Usuário
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* User List */}
                    <div className={`lg:col-span-${isCreating ? '2' : '3'} space-y-4`}>

                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12 text-zinc-500">Carregando usuários...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500 bg-white/5 rounded-xl border border-white/5">
                                Nenhum usuário encontrado.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="glass-card p-5 border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10">
                                                <span className="text-lg font-bold text-zinc-400">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{user.name}</h3>
                                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                                    <span className="flex items-center gap-1">
                                                        <Shield className="w-3 h-3" />
                                                        @{user.username}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'nwz' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        user.role === 'parceiro' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                                        }`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                            {user.store && (
                                                <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                                                    <Store className="w-4 h-4" />
                                                    {user.store}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Remover usuário"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Create Form Sidebar */}
                    {isCreating && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <UserForm
                                    onSuccess={() => {
                                        setIsCreating(false);
                                        loadUsers();
                                    }}
                                    onCancel={() => setIsCreating(false)}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
