<?php

namespace App\Http\Controllers;

use App\Enum\EnumStatusLoan;
use App\Http\Requests\BookStoreRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Book::select(['books.id', 'title', 'author', 'quantity'])
                ->selectRaw('SUM(CASE WHEN loans.status = "'.EnumStatusLoan::BORROWED.'" THEN 1 ELSE 0 END) as borrowed')
                ->filterSearch()
                ->leftJoin('loans', 'books.id', '=', 'loans.book_id')
                ->orderBy('title', 'ASC')
                ->groupBy('books.id')
                ->paginate(config('pagination.pages'))
        );
    }

    public function store(BookStoreRequest $request): JsonResponse
    {
        $book = Book::create($request->only(['title', 'author', 'quantity']));
        return response()->json([
            'message' => 'Livro cadastrado com sucesso!',
            'book' => $book
        ], 201);
    }

    public function update(BookStoreRequest $request, $id): JsonResponse
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json([
                'message' => 'Livro não encontrado!'
            ], 404);
        }
        $book->update($request->only(['title', 'author', 'quantity']));
        return response()->json([
            'message' => 'Livro atualizado com sucesso!',
            'book' => $book
        ]);
    }
}
