<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Item::insert([[
            'name'=>'ハチ',
            'required_skill'=>1,
            'avatar_path'=>'./images/items/bee_smile.png',
        ],[
            'name'=>'ちょうちょ',
            'required_skill'=>2,
            'avatar_path'=>'./images/items/butterfly_smile.png',
        ],[
            'name'=>'はな',
            'required_skill'=>3,
            'avatar_path'=>'./images/items/flower_smile.png',
        ],[
            'name'=>'キウイ',
            'required_skill'=>4,
            'avatar_path'=>'./images/items/kiwi.png',
        ],[
            'name'=>'月と星',
            'required_skill'=>5,
            'avatar_path'=>'./images/items/moon&star_smile.png',
        ],[
            'name'=>'なし',
            'required_skill'=>6,
            'avatar_path'=>'./images/items/none.png',
        ],[
            'name'=>'いちご',
            'required_skill'=>7,
            'avatar_path'=>'./images/items/strawberry.png',
        ],[
            'name'=>'トマト',
            'required_skill'=>8,
            'avatar_path'=>'./images/items/tomato.png',
        ],[
            'name'=>'おひさま',
            'required_skill'=>9,
            'avatar_path'=>'./images/items/sun_smile.png',
        ],[
            'name'=>'UFO',
            'required_skill'=>10,
            'avatar_path'=>'./images/items/ufo_smile.png',
        ]]);
    }
}
