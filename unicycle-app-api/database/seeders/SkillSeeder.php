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
            'name' =>'ジグザグコース',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 6,
            'animal_id' => 2,
        ],[
            'name' =>'右回り3周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 7,
            'animal_id' => 2,
        ],[
            'name' =>'左回り３周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 8,
            'animal_id' => 2,
        ],[
            'name' =>'8の字ひこうき（大）',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 9,
            'animal_id' => 2,
        ],[
            'name' =>'8の字ひこうき（小）',
            'description' => 'アリーナの壁から壁までを往復して走る',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 10,
            'animal_id' => 2,
        ],[
            'name' =>'空中乗り',
            'description' => '壁を使わずにその場で一輪車に乗る',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 11,
            'animal_id' => 3,
        ],[
            'name' =>'アイドリング3回（前→後ろ→前で1回）',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 12,
            'animal_id' => 3,
        ],[
            'name' =>'バック走行5m',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 13,
            'animal_id' => 3,
        ],[
            'name' =>'アイドリング10回',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 14,
            'animal_id' => 3,
        ],[
            'name' =>'バック走行10m',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 15,
            'animal_id' => 3,
        ],[
            'name' =>'アイドリング20回',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 16,
            'animal_id' => 3,
        ],[
            'name' =>'バック走行20m',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 17,
            'animal_id' => 4,
        ],[
            'name' =>'あめ玉スピン',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 18,
            'animal_id' => 4,
        ],[
            'name' =>'3分間乗り続ける（ラン）',
            'description' => '止まらず、足をつかずに3分間乗り続ける',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 19,
            'animal_id' => 4,
        ],[
            'name' =>'ホッピング1回',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 20,
            'animal_id' => 4,
        ],[
            'name' =>'アイドリング30回',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 21,
            'animal_id' => 4,
        ],[
            'name' =>'バック走行30m',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 22,
            'animal_id' => 4,
        ],[
            'name' =>'右回り3周→左回り3周→8の字ひこうき1周',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 23,
            'animal_id' => 4,
        ],[
            'name' =>'アイドリング50回以上',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 24,
            'animal_id' => 4,
        ],[
            'name' =>'横乗り',
            'description' => '',
            'avatar_path' => '',
            'movie_path' => '',
            'level' => 25,
            'animal_id' => 4,
        ]]);
    }
}
