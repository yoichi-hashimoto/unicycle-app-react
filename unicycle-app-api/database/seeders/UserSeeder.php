<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([[
            'name' => 'よういち',
            'password' => Hash::make('test'),
            'user_avatar_id' => 1,
            'background_color' => '#FF5733',
            'is_admin' => true,
        ],[
            'name' => 'ゆうき',
            'password' => Hash::make('test'),
            'user_avatar_id' => 2,

            'background_color' => '#33C1FF',
            'is_admin' => false,
        ],[
            'name' => 'ちほ',
            'password' => Hash::make('test'),
            'user_avatar_id' => 3,

            'background_color' => '#FF33A8',
            'is_admin' => false,
        ],[
            'name' => 'なお',
            'password' => Hash::make('test'),
            'user_avatar_id' => 4,
            'background_color' => '#33FF57',
            'is_admin' => false,
        ],[
            'name' => 'はるき',
            'password' => Hash::make('test'),
            'user_avatar_id' => 5,
            'background_color' => '#FF8C33',
            'is_admin' => false,
        ]]);
    }
}
