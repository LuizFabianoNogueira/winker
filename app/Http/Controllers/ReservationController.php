<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationStoreRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Reservation::filterSearch()
                ->select([
                    'reservations.id',
                    'reservations.reservation_date',
                    'reservations.status',
                    'books.title',
                    'books.author',
                    'users.name as user'
                ])
                ->when((Auth::user()->role === 'user'), function ($q) {
                    return $q->where('user_id',  Auth::user()->id);
                })
                ->join('books', 'reservations.book_id', '=', 'books.id')
                ->join('users', 'reservations.user_id', '=', 'users.id')
                ->orderBy('reservations.created_at', 'DESC')
                ->paginate(config('pagination.pages'))
        );
    }

    public function toReservation(Request $request): JsonResponse
    {
        $check = Reservation::where('book_id', $request['book_id'])
            ->where('user_id', $request['user_id'])
            ->where('status', 'pending')
            ->count();

        if (!$check) {
            $reservation = Reservation::create([
                'book_id' => $request['book_id'],
                'user_id' => $request['user_id'],
                'reservation_date' => date('Y-m-d H:i:s'),
            ]);

            return response()->json([
                'message' => 'Reserva registrada com sucesso!',
                'reservation' => $reservation
            ], 201);
        }

        return response()->json([
            'message' => 'Reserva já realizada para este livro.'
        ], 400);
    }
}
