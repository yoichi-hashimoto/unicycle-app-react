<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable =[
        'name','color_path'
    ];

    public function users(){
        return $this->hasMany(User::class);
    }
}
