import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: '/books',
    },
];

export default function Books() {
    const [books, setBooks] = useState({ data: [], links: [] });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const fetchBooks = async (queryParams = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/books-data?${queryParams}`);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Erro ao buscar livros:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBooks(`search=${search}`);
    };

    const handlePagination = (url: string | null) => {
        if (url) {
            const params = new URL(url).searchParams.toString();
            fetchBooks(params);
        }
    };

    const handleBorrowBook = async (bookId: number) => {
        const isConfirmed = window.confirm('Tem certeza que deseja emprestar este livro?');
        if (isConfirmed) {
            try {
                setLoading(true);
                const response = await fetch(`/loans-data/toLoan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        book_id: bookId,
                        user_id: auth.user.id
                    }),
                });

                if (response.ok) {
                    alert('Livro emprestado com sucesso!');
                    fetchBooks();
                } else {
                    alert('Erro ao registrar o empréstimo!');
                }
            } catch (error) {
                console.error('Erro ao registrar o empréstimo:', error);
                alert('Erro ao registrar o empréstimo!');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReserveBook = async (bookId: number) => {
        const isConfirmed = window.confirm('Tem certeza que deseja reservar este livro?');
        if (isConfirmed) {
            try {
                setLoading(true);
                const response = await fetch(`/reservations-data/toReservation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        book_id: bookId,
                        user_id: auth.user.id
                    }),
                });

                if (response.ok) {
                    alert('Livro reservado com sucesso!');
                    fetchBooks();
                } else {
                    alert('Erro ao registrar a reserva!');
                }
            } catch (error) {
                console.error('Erro ao registrar a reserva:', error);
                alert('Erro ao registrar a reserva!');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />

            <div className="p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar livro..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Pesquisar</button>
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
                                <th className="border border-gray-800 px-4 py-2 text-center">Quantidade</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Emprestados</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Livres</th>
                                <th className="border border-gray-800 px-4 py-2 text-center">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {books.data.length > 0 ? (
                                books.data.map((book: any) => (
                                    <tr key={book.id} className="border border-gray-300">
                                        <td className="border border-gray-800 px-4 py-2">{book.id}</td>
                                        <td className="border border-gray-800 px-4 py-2">{book.title}</td>
                                        <td className="border border-gray-800 px-4 py-2">{book.author}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.quantity}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.borrowed}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.quantity - book.borrowed}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">
                                            {auth.user.role === 'admin' ? (
                                                <button className="bg-gray-500 text-white px-3 py-1 rounded">Emprestimos</button>
                                            ) : (
                                                (book.quantity - book.borrowed) > 0 ? (
                                                    <button
                                                        onClick={() => handleBorrowBook(book.id)} // Chama a função handleBorrowBook ao clicar
                                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Emprestar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReserveBook(book.id)} // Chama a função handleReserveBook ao clicar
                                                        className="bg-orange-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Reservar
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">Nenhum livro encontrado.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {books.links.map((link: any, index: number) => (
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
