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

    /**
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        return response()->json(Book::findOrFail($id));
    }
}
