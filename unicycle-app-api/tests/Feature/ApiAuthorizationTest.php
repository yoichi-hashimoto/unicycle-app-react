<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_update_a_user(): void
    {
        $user = User::factory()->create();

        $this->patchJson("/api/users/{$user->id}", ['name' => 'changed'])
            ->assertUnauthorized();
    }

    public function test_user_cannot_update_another_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($user)
            ->patchJson("/api/users/{$other->id}", ['name' => 'changed'])
            ->assertForbidden();
    }

    public function test_non_admin_cannot_register_a_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/users', [])
            ->assertForbidden();
    }
}
