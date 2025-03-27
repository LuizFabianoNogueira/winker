import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: '/reservations',
    },
];

export default function Reservations() {
    const [reservations, setReservations] = useState({ data: [], links: [] });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para buscar reservas com os parâmetros de consulta
    const fetchReservations = async (queryParams = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/reservations-data?${queryParams}`);
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error("Erro ao buscar reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carregar reservas ao montar o componente
    useEffect(() => {
        fetchReservations();
    }, []);

    // Função de pesquisa
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReservations(`search=${search}`);
    };

    // Função para lidar com a paginação
    const handlePagination = (url: string | null) => {
        if (url) {
            const params = new URL(url).searchParams.toString();
            fetchReservations(params);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservations" />

            <div className="p-4">
                {/* Campo de Pesquisa */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar reserva..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Pesquisar</button>
                </form>

                {/* Tabela de Reservas */}
                <div className="overflow-x-auto rounded-xl border">
                    {loading ? (
                        <p className="text-center p-4">Carregando...</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-800">
                            <thead className="bg-gray-900">
                            <tr>
                                <th className="border border-gray-800 px-4 py-2">Título</th>
                                <th className="border border-gray-800 px-4 py-2">Autor</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Data</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Usuário</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reservations.data.length > 0 ? (
                                reservations.data.map((reservation: any) => (
                                    <tr key={reservation.id} className="border border-gray-300">
                                        <td className="border border-gray-800 px-4 py-2">{reservation.title}</td>
                                        <td className="border border-gray-800 px-4 py-2">{reservation.author}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{reservation.reservation_date}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{reservation.user}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">Nenhuma reserva encontrada.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Paginação */}
                <div className="mt-4 flex justify-center gap-2">
                    {reservations.links.map((link: any, index: number) => (
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
