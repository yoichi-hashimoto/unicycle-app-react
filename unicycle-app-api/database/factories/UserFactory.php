<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserAvatar;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->userName(),
            'login_id' => fake()->unique()->bothify('user####'),
            'password' => static::$password ??= Hash::make('password'),
            'user_avatar_id' => UserAvatar::factory(),
            'color_id' => null,
            'is_admin' => false,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }
}
