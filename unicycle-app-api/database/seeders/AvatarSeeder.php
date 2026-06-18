<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserAvatar;

class AvatarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserAvatar::insert([[
            'id' => 1,
            'avatar_path'=> './images/users/avatar_01_r1_c1.png'
        ],[
            'id'=>2,
            'avatar_path' =>'./images/users/avatar_02_r1_c2.png'
        ],[
                        'id' => 3,
            'avatar_path'=> './images/users/avatar_03_r1_c3.png'
        ],[
                        'id' => 4,
            'avatar_path'=> './images/users/avatar_04_r1_c4.png'

        ],[
                        'id' => 5,
            'avatar_path'=> './images/users/avatar_05_r1_c5.png'

        ],[
                        'id' => 6,
            'avatar_path'=> './images/users/avatar_06_r1_c6.png'

        ],[
                        'id' => 7,
            'avatar_path'=> './images/users/avatar_07_r1_c7.png'
        ],[
                        'id' => 8,
            'avatar_path'=> './images/users/avatar_08_r1_c8.png'

        ],[
                        'id' => 9,
            'avatar_path'=> './images/users/avatar_09_r1_c9.png'

        ],[
            'id' => 10,
            'avatar_path'=> './images/users/avatar_10_r1_c10.png'
        ],[
            'id'=>11,
            'avatar_path' =>'./images/users/avatar_11_r2_c1.png'
        ],[
            'id'=>12,
            'avatar_path' =>'./images/users/avatar_12_r2_c2.png'
        ],[
            'id'=>13,
            'avatar_path' =>'./images/users/avatar_13_r2_c3.png'
        ],[
            'id'=>14,
            'avatar_path' =>'./images/users/avatar_14_r2_c4.png'
        ],[
            'id'=>15,
            'avatar_path' =>'./images/users/avatar_15_r2_c5.png'
        ],[
            'id'=>16,
            'avatar_path' =>'./images/users/avatar_16_r2_c6.png'
        ],[
            'id'=>17,
            'avatar_path' =>'./images/users/avatar_17_r2_c7.png'
        ],[
            'id'=>18,
            'avatar_path' =>'./images/users/avatar_18_r2_c8.png'
        ],[
            'id'=>19,
            'avatar_path' =>'./images/users/avatar_19_r2_c9.png'
        ],[
            'id'=>20,
            'avatar_path' =>'./images/users/avatar_20_r2_c10.png'
        ],[
            'id'=>21,
            'avatar_path' =>'./images/users/avatar_21_r3_c1.png'
        ],[
            'id'=>22,
            'avatar_path' =>'./images/users/avatar_22_r3_c2.png'
        ],[
            'id'=>23,
            'avatar_path' =>'./images/users/avatar_23_r3_c3.png'
        ],[
            'id'=>24,
            'avatar_path' =>'./images/users/avatar_24_r3_c4.png'
        ],[
            'id'=>25,
            'avatar_path' =>'./images/users/avatar_25_r3_c5.png'
        ],[
            'id'=>26,
            'avatar_path' =>'./images/users/avatar_26_r3_c6.png'
        ],[
            'id'=>27,
            'avatar_path' =>'./images/users/avatar_27_r3_c7.png'
        ],[
            'id'=>28,
            'avatar_path' =>'./images/users/avatar_28_r3_c8.png'
        ],[
            'id'=>29,
            'avatar_path' =>'./images/users/avatar_29_r3_c9.png'
        ],[
            'id'=>30,
            'avatar_path' =>'./images/users/avatar_30_r3_c10.png'
        ]]);
    }
}
