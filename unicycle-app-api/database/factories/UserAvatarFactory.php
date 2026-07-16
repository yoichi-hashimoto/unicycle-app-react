<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserAvatarFactory extends Factory
{
    public function definition(): array
    {
        return [
            'avatar_path' => '/images/users/avatar_01_r1_c1.png',
        ];
    }
}
