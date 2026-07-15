<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'required_skill',
        'avatar_path',
    ];

    public function users()
    {
        return $this->hasMany(UserItem::class);
    }
}
