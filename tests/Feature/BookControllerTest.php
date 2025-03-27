<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function test_can_list_books()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $responseLogin = $this->actingAs($user)->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);

        Book::factory()->count(3)->create();
        $response = $this->getJson('/books-data/');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'title', 'author', 'quantity']]]);
    }

    #[Test]
    public function test_can_show_a_single_book()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $responseLogin = $this->actingAs($user)->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);

        $book = Book::factory()->create();
        $response = $this->getJson('/books-data', ['title' => $book->title]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    [
                        'id',
                        'title',
                        'author'
                    ],
                ]
            ]);

        $response->assertJsonFragment([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
        ]);
    }
}
