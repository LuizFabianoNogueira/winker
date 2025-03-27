<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Book;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function test_can_list_reservations()
    {
        $user = User::factory()->create();
        $book = Book::factory()->create();
        Reservation::factory()->create(['user_id' => $user->id, 'book_id' => $book->id]);
        $response = $this->actingAs($user)->getJson('/reservations-data');
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [['id', 'reservation_date', 'status', 'title', 'author', 'user']],
        ]);
    }

    #[Test]
    public function test_can_create_a_reservation()
    {
        $this->withoutMiddleware();
        $user = User::factory()->create();
        $book = Book::factory()->create();
        $response = $this->actingAs($user)->postJson('/reservations-data/toReservation', [
            'book_id' => $book->id,
            'user_id' => $user->id,
        ]);
        $response->assertStatus(201)
            ->assertJson(['message' => 'Reserva registrada com sucesso!']);

        $this->assertDatabaseHas('reservations', [
            'book_id' => $book->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    #[Test]
    public function test_does_not_allow_duplicate_reservations()
    {
        $this->withoutMiddleware();
        $user = User::factory()->create();
        $book = Book::factory()->create();
        Reservation::factory()->create(['book_id' => $book->id, 'user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user)->postJson('/reservations-data/toReservation', [
            'book_id' => $book->id,
            'user_id' => $user->id,
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Reserva já realizada para este livro.']);
    }
}
