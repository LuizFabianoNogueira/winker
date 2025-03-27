<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ReservationController;
use Inertia\Inertia;

Route::get('/', static function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', static function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('users', static function () {
        return Inertia::render('users');
    })->name('users');

    Route::get('books', static function () {
        return Inertia::render('books');
    })->name('books');

    Route::get('reservations', static function () {
        return Inertia::render('reservations');
    })->name('reservations');

    Route::get('loans', static function () {
        return Inertia::render('loans');
    })->name('loans');

    Route::prefix('users-data')->group(function () {
        Route::get('/', [UserController::class, 'index']);
    });

    Route::prefix('books-data')->group(function () {
        Route::get('/', [BookController::class, 'index']);
        Route::get('/{id}', [BookController::class, 'show']);
    });

    Route::prefix('reservations-data')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::post('/toReservation', [ReservationController::class, 'toReservation']);
    });

    Route::prefix('loans-data')->group(function () {
        Route::get('/', [LoanController::class, 'index']);
        Route::post('/toLoan', [LoanController::class, 'toLoan']);
        Route::post('/{id}/return', [LoanController::class, 'returnBook']);
    });



});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
