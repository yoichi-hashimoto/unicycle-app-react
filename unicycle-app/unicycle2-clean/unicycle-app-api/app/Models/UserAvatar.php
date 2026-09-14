<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAvatar extends Model
{
    protected $fillable = ['id','avatar_path'];

    public function user(){
    return $this->belongsTo(User::class);}

}
