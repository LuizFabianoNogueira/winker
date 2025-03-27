<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        $user = User::factory()->create(); // Cria um usuário com a UserFactory
        $book = Book::factory()->create();

        return [
            'user_id' => $user->id,
            'book_id' => $book->id,
            'loan_date' => $this->faker->date(),
            'return_date' => $this->faker->date(),
            'status' => 'borrowed',
        ];
    }
}
