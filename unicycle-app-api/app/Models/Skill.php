<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'description','avatar_path','movie_path','required_level','animal_id','point'];

    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
