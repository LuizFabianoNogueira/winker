import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Books', href: '/books' },
];

export default function Books() {
    const [books, setBooks] = useState({ data: [], links: [] });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', author: '', quantity: 1 });
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

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

    const handleAddBook = async () => {
        try {
            setLoading(true);
            const response = await fetch('/books-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(newBook),
            });

            if (response.ok) {
                alert('Livro cadastrado com sucesso!');
                setShowModal(false);
                setNewBook({ title: '', author: '', quantity: 1 });
                fetchBooks();
            } else {
                alert('Erro ao cadastrar livro!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar livro:', error);
            alert('Erro ao cadastrar livro!');
        } finally {
            setLoading(false);
        }
    };

    const handleEditBook = (book) => {
        setEditBook(book);
        setShowModal(true);
        setNewBook({ title: book.title, author: book.author, quantity: book.quantity });
    };

    const handleUpdateBook = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/books-data/${editBook.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(newBook),
            });

            if (response.ok) {
                alert('Livro atualizado com sucesso!');
                setShowModal(false);
                setEditBook(null);
                fetchBooks();
            } else {
                alert('Erro ao atualizar livro!');
            }
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            alert('Erro ao atualizar livro!');
        } finally {
            setLoading(false);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBook(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
            <div className="p-4">
                {auth.user.role === 'admin' && (
                    <button
                        onClick={() => { setShowModal(true); setEditBook(null); setNewBook({ title: '', author: '', quantity: 1 }); }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
                    >
                        Cadastrar Livro
                    </button>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                {editBook ? 'Editar Livro' : 'Adicionar Livro'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newBook.title}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Autor</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={newBook.author}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={newBook.quantity}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={editBook ? handleUpdateBook : handleAddBook}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : (editBook ? 'Atualizar' : 'Salvar')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                books.data.map((book) => (
                                    <tr key={book.id} className="border border-gray-300">
                                        <td className="border border-gray-800 px-4 py-2">{book.id}</td>
                                        <td className="border border-gray-800 px-4 py-2">{book.title}</td>
                                        <td className="border border-gray-800 px-4 py-2">{book.author}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.quantity}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.borrowed}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">{book.quantity - book.borrowed}</td>
                                        <td className="border border-gray-800 px-4 py-2 text-center">
                                            {auth.user.role === 'admin' ? (
                                                <button onClick={() => handleEditBook(book)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Editar</button>
                                            ) : (
                                                (book.quantity - book.borrowed) > 0 ? (
                                                    <button
                                                        onClick={() => handleBorrowBook(book.id)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Emprestar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReserveBook(book.id)}
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
            </div>
        </AppLayout>
    );
}
