<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title'       => $this->faker->sentence(3), // Gera um título de livro
            'author'      => $this->faker->name, // Gera o nome de um autor
            'quantity'    => $this->faker->numberBetween(1, 50), // Quantidade aleatória
            'created_at'  => now(),
            'updated_at'  => now(),
        ];
    }
}
