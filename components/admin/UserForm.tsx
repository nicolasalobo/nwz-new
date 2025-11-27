'use client';

import { useState } from 'react';
import { User, UserPlus, Shield, Lock, Store, Check, X, Loader2 } from 'lucide-react';
import { createUser } from '@/app/actions/user-actions';

interface UserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UserForm({ onSuccess, onCancel }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState('parceiro');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError('');

        try {
            const result = await createUser(formData);
            if (result.success) {
                onSuccess();
            } else {
                setError(result.message || 'Erro ao criar usuário');
            }
        } catch (e) {
            setError('Ocorreu um erro inesperado');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="glass-card p-6 border-white/10 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-400" />
                    Novo Usuário
                </h2>
                <button onClick={onCancel} className="text-zinc-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Nome Completo</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="Ex: João Silva"
                            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Usuário</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="joao.silva"
                            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Senha</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••"
                            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Cargo</label>
                        <select
                            name="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="parceiro" className="bg-zinc-900">Parceiro</option>
                            <option value="afiliado" className="bg-zinc-900">Afiliado</option>
                            <option value="nwz" className="bg-zinc-900">NWZ (Admin)</option>
                        </select>
                    </div>

                    {/* Store */}
                    {selectedRole === 'afiliado' && (
                        <div className="space-y-1 animate-fade-in">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Loja</label>
                            <div className="relative">
                                <select
                                    name="store"
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900">Nenhuma</option>
                                    <option value="Loja Centro" className="bg-zinc-900">Loja Centro</option>
                                    <option value="Loja Shopping" className="bg-zinc-900">Loja Shopping</option>
                                    <option value="Loja Online" className="bg-zinc-900">Loja Online</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Store className="h-4 w-4 text-zinc-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="pt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Criar Usuário
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
