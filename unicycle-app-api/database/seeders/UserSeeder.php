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
            'login_id'=>'OUC3456',
            'password' => Hash::make('test'),
            'user_avatar_id' => 1,
            'background_color' => '#FF5733',
            'is_admin' => true,
        ],[
            'name' => 'ゆうき',
            'login_id'=>'OUC2345',
            'password' => Hash::make('test'),
            'user_avatar_id' => 2,
            'background_color' => '#33C1FF',
            'is_admin' => false,
        ],[
            'name' => 'ちほ',
            'login_id'=>'OUC0123',
            'password' => Hash::make('test'),
            'user_avatar_id' => 3,
            'background_color' => '#FF33A8',
            'is_admin' => false,
        ],[
            'name' => 'なお',
            'login_id'=>'OUC1234',
            'password' => Hash::make('test'),
            'user_avatar_id' => 4,
            'background_color' => '#33FF57',
            'is_admin' => false,
        ],[
            'name' => 'はるき',
            'login_id'=>'OUC7890',
            'password' => Hash::make('test'),
            'user_avatar_id' => 5,
            'background_color' => '#FF8C33',
            'is_admin' => false,
        ]]);
    }
}
