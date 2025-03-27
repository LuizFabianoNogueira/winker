<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            User::filterSearch()
                ->orderBy('name','ASC')
                ->paginate(config('pagination.pages'))
        );
    }
}
