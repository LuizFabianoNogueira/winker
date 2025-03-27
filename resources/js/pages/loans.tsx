import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loans',
        href: '/loans',
    },
];

export default function Loans() {
    const [loans, setLoans] = useState({ data: [], links: [] });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [loanDateStart, setLoanDateStart] = useState('');
    const [loanDateEnd, setLoanDateEnd] = useState('');
    const [returnDateStart, setReturnDateStart] = useState('');
    const [returnDateEnd, setReturnDateEnd] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLoans = async (queryParams = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/loans-data?${queryParams}`);
            const data = await response.json();
            setLoans(data);
        } catch (error) {
            console.error("Erro ao buscar empréstimos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        let queryParams = `search=${search}`;
        if (status) queryParams += `&status=${status}`;
        if (loanDateStart) queryParams += `&loan_date_start=${loanDateStart}`;
        if (loanDateEnd) queryParams += `&loan_date_end=${loanDateEnd}`;
        if (returnDateStart) queryParams += `&return_date_start=${returnDateStart}`;
        if (returnDateEnd) queryParams += `&return_date_end=${returnDateEnd}`;
        fetchLoans(queryParams);
    };

    const handlePagination = (url: string | null) => {
        if (url) {
            const params = new URL(url).searchParams.toString();
            fetchLoans(params);
        }
    };

    const handleReturn = async (loanId: number) => {
        if (window.confirm('Tem certeza que deseja devolver este livro?')) {
            try {
                const response = await fetch(`/loans-data/${loanId}/return`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({
                        loan_id: loanId,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Livro devolvido com sucesso!');
                    fetchLoans();
                } else {
                    alert('Erro ao devolver o livro: ' + data.message);
                }
            } catch (error) {
                console.error("Erro ao devolver o livro:", error);
                alert('Erro ao devolver o livro. Tente novamente.');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loans" />

            <div className="p-4">
                <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-4">
                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="search" className="mb-2 text-sm font-medium">Buscar empréstimo:</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Buscar empréstimo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full sm:w-64"
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="status" className="mb-2 text-sm font-medium">Situação:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border rounded-lg px-3 py-2 w-full sm:w-64"
                        >
                            <option value="">Selecionar Situação</option>
                            <option value="borrowed">Empréstimo</option>
                            <option value="returned">Devolvido</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="loan_date_start" className="mb-2 text-sm font-medium">Data de Retirada (Início):</label>
                        <input
                            id="loan_date_start"
                            type="date"
                            value={loanDateStart}
                            onChange={(e) => setLoanDateStart(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="loan_date_end" className="mb-2 text-sm font-medium">Data de Retirada (Fim):</label>
                        <input
                            id="loan_date_end"
                            type="date"
                            value={loanDateEnd}
                            onChange={(e) => setLoanDateEnd(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="return_date_start" className="mb-2 text-sm font-medium">Data de Devolução (Início):</label>
                        <input
                            id="return_date_start"
                            type="date"
                            value={returnDateStart}
                            onChange={(e) => setReturnDateStart(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                        <label htmlFor="return_date_end" className="mb-2 text-sm font-medium">Data de Devolução (Fim):</label>
                        <input
                            id="return_date_end"
                            type="date"
                            value={returnDateEnd}
                            onChange={(e) => setReturnDateEnd(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 sm:mt-0">Pesquisar</button>
                </form>

                <div className="overflow-x-auto rounded-xl border">
                    {loading ? (
                        <p className="text-center p-4">Carregando...</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-800">
                            <thead className="bg-gray-900">
                            <tr>
                                <th className="border border-gray-800 px-4 py-2">ID</th>
                                <th className="border border-gray-800 px-4 py-2">Título</th>
                                <th className="border border-gray-800 px-4 py-2">Autor</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Situação</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Retirado</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Devolvido</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Usuário</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loans.data.length > 0 ? (
                                loans.data.map((loan: any) => (
                                    <tr key={loan.id} className="border border-gray-300">
                                        <td className="border border-gray-800 px-4 py-2">{loan.id}</td>
                                        <td className="border border-gray-800 px-4 py-2">{loan.title}</td>
                                        <td className="border border-gray-800 px-4 py-2">{loan.author}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{loan.status}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{loan.loan_date}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{loan.return_date}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{loan.user}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">
                                            {loan.status === 'borrowed' ? (
                                                <button
                                                    className="bg-gray-500 text-white px-3 py-1 rounded"
                                                    onClick={() => handleReturn(loan.id)}
                                                >
                                                    Devolver
                                                </button>
                                            ) : ''}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">Nenhum empréstimo encontrado.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {loans.links.map((link: any, index: number) => (
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
