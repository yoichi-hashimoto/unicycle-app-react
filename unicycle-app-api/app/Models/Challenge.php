<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = ['title', 'description', 'user_id','skill_id','success_score'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    public function getUserNameAttribute()
    {
        return $this->user ? $this->user->name : null;
    }

    public function getUserAvatarPathAttribute()
    {
        return $this->user ? $this->user->avatar_path : null;
    }

    public function getCurrentAnimalAttribute()
    {
        return $this->user && $this->user->current_animal->avatar_path ? $this->user->current_animal->avatar_path : null;
    }

    public function getSkillNameAttribute()
    {
        return $this->skill ? $this->skill->name : null;
    }

    public function getCurrentLevelAttribute()
    {
        return $this->skill ? $this->skill->level : null;
    }

    public function getReceivedLikesAttribute()
    {
        return $this->likes()->count();
    }

}
