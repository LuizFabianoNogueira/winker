import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users() {
    const [users, setUsers] = useState({ data: [], links: [] });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (queryParams = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/users-data?${queryParams}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(`search=${search}`);
    };

    const handlePagination = (url: string | null) => {
        if (url) {
            const params = new URL(url).searchParams.toString();
            fetchUsers(params);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="p-4">
                {/* Campo de Pesquisa */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar usuário..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Pesquisar</button>
                </form>

                {/* Tabela de Usuários */}
                <div className="overflow-x-auto rounded-xl border">
                    {loading ? (
                        <p className="text-center p-4">Carregando...</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-800">
                            <thead className="bg-gray-900">
                            <tr>
                                <th className="border border-gray-800 px-4 py-2 ">ID</th>
                                <th className="border border-gray-800 px-4 py-2 ">Nome</th>
                                <th className="border border-gray-800 px-4 py-2 ">Email</th>
                                <th className="border border-gray-800 px-4 py-2 ">Perfil</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.data.length > 0 ? (
                                users.data.map((user: any) => (
                                    <tr key={user.id} className="border border-gray-800">
                                        <td className="border border-gray-800 px-4 py-2">{user.id}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.name}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.role}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">Nenhum usuário encontrado.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Paginação */}
                <div className="mt-4 flex justify-center gap-2">
                    {users.links.map((link: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => handlePagination(link.url)}
                            className={`px-3 py-2 rounded-lg ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-900'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
