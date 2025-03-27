<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function test_can_list_loans()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        Loan::factory()->count(3)->create(['user_id' => $user->id]);
        $response = $this->getJson('/loans-data/');
        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'loan_date', 'return_date', 'status', 'user_id', 'title', 'author', 'user']]]);
    }

    #[Test]
    public function test_can_return_a_book()
    {
        $this->withoutMiddleware();
        $loan = Loan::factory()->create(['status' => 'borrowed']);
        $response = $this->postJson("/loans-data/{$loan->id}/return");
        $response->assertStatus(200)
            ->assertJson(['status' => 'returned']);
    }

    #[Test]
    public function test_cannot_loan_unavailable_book()
    {
        $this->withoutMiddleware();
        $user = User::factory()->create();
        $this->actingAs($user);
        $book = Book::factory()->create(['quantity' => 0]);
        $response = $this->postJson('/loans-data/toLoan', ['book_id' => $book->id, 'user_id' => $user->id]);
        $response->assertStatus(400)
            ->assertJson(['message' => 'Livro não disponível para empréstimo.']);
    }

    #[Test]
    public function test_can_create_a_loan()
    {
        $this->withoutMiddleware();
        $user = User::factory()->create();
        $this->actingAs($user);
        $book = Book::factory()->create(['quantity' => 5]);
        $response = $this->postJson('/loans-data/toLoan', ['book_id' => $book->id, 'user_id' => $user->id]);
        $response->assertStatus(201)
            ->assertJson(['message' => 'Empréstimo registrado com sucesso!']);
    }
}
