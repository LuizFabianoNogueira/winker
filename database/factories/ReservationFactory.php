<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $user = User::factory()->create();
        $book = Book::factory()->create();
        return [
            'user_id' => $user->id,
            'book_id' => $book->id,
            'reservation_date' => $this->faker->dateTimeThisYear(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'cancelled']),
        ];
    }
}
