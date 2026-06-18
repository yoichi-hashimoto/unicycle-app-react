<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Skill::insert([[
            'name' =>'アリーナ壁から壁まで',
            'description' => 'アリーナの壁から壁までを往復して走る',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 1,
            'animal_id' => 1,
        ],[
            'name' =>'アリーナ1周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 2,
            'animal_id' => 1,
        ],[
            'name' =>'アリーナ2周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 3,
            'animal_id' => 1,
        ],[
            'name' =>'アリーナ3周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 4,
            'animal_id' => 1,
        ],[
            'name' =>'1周から逆回り',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 5,
            'animal_id' => 1,
        ],[
            'name' =>'1周から逆回り2',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 6,
            'animal_id' => 2,
        ],[
            'name' =>'1周から逆回り3',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 7,
            'animal_id' => 2,
        ],[
            'name' =>'1周から逆回り4',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 8,
            'animal_id' => 2,
        ],[
            'name' =>'1周から逆回り5',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 9,
            'animal_id' => 2,
        ]]);
    }
}
