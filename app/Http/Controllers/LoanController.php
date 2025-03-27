<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Loan;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Loan::select('loans.id', 'loans.loan_date', 'loans.return_date', 'loans.status', 'loans.user_id', 'books.title', 'books.author', 'users.name as user')
                ->when((Auth::user()->role === 'user'), function ($q) {
                    return $q->where('user_id',  Auth::user()->id);
                })
                ->join('books', 'loans.book_id', '=', 'books.id')
                ->join('users', 'loans.user_id', '=', 'users.id')
                ->filterSearch()
                ->orderBy('loans.created_at', 'ASC')
                ->paginate(config('pagination.pages'))
        );
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function returnBook($id): JsonResponse
    {
        $loan = Loan::findOrFail($id);
        $loan->update(['status' => 'returned', 'return_date' => now()]);
        return response()->json($loan);
    }

    public function toLoan(Request $request): JsonResponse
    {
        $book = Book::findOrFail($request['book_id']);
        if ($book->quantity - $book->borrowed <= 0) {
            return response()->json([
                'message' => 'Livro não disponível para empréstimo.'
            ], 400);
        }
        $loan = Loan::create([
            'book_id' => $request['book_id'],
            'user_id' => $request['user_id'],
            'loan_date' => date('Y-m-d H-i-s'),
        ]);
        $book->save();

        return response()->json(['message' => 'Empréstimo registrado com sucesso!', 'loan' => $loan], 201);
    }
}
