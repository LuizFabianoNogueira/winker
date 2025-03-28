<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function test_can_list_users()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        User::factory()->count(5)->create();
        $response = $this->getJson('users-data');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email', 'created_at', 'updated_at']
            ]
        ]);
    }

    #[Test]
    public function test_can_search_users()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Maria Smith']);
        $response = $this->getJson('/users-data?search=John');
        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'John Doe'])
            ->assertJsonMissing(['name' => 'Maria Smith']);
    }
}
