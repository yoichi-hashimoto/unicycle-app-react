<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserAvatar;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'background_color' => 'string',
            'login_id'=>'string',
            'user_avatar_id' =>'string',
            'password' => 'hashed',
        ];
    }

    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function avatars(){
        return $this->hasMany(UserAvatar::class);
    }

    public function getAvatarPathAttribute(){
        $avatar = UserAvatar::where('id',$this->user_avatar_id)->first(); 
        return $avatar ? $avatar->avatar_path:null;
    }

    public function getCurrentLevelAttribute()
    {
        $challenge = Challenge::where('user_id',$this->id)
        ->orderByDesc('id')->first();
        return $challenge ? $challenge->skill->level : 0;
    }

    public function getCurrentAnimalAttribute()
    {
        $challenge = Challenge::where('user_id',$this->id)
        ->orderByDesc('id')->first();
        return $challenge ? $challenge->skill->animal : null;
    }

    public function getReceivedLikesAttribute()
    {
        return $this->likes()->count();
    }

    public function getRemainLevelAttribute()
    {
            return 6 - ( $this->current_level % 5);
        }


    public function getSkillNameAttribute(){
        return Skill::where('level',$this->current_level)->first()->name ?? null;
    }

    public function getSuccessScoreAttribute(){
        $challenge = Challenge::where('user_id',$this->id)
        ->latest()->first();
        return $challenge ? $challenge->success_score : null;
    }
}