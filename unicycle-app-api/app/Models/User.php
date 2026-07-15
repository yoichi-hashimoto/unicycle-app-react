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
use App\Models\Animal;
use App\Models\UserItem;
use App\Models\Items;

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
            'color_id' => 'integer',
            'login_id'=>'integer',
            'user_avatar_id' =>'integer',
            'password' => 'hashed',
            'is_admin' =>'boolean',
            'equipped_item_id'=>'boolean',
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

    public function colors(){
        return $this->hasMany(Color::class);
    }

    public function avatars(){
        return $this->hasMany(UserAvatar::class);
    }

    public function getColorPathAttribute(){
        $color = Color::where('id',$this->color_id)->first();
        return $color ? $color->color_path:null;
    }

    public function getAvatarPathAttribute(){
        $avatar = UserAvatar::where('id',$this->user_avatar_id)->first(); 
        return $avatar ? $avatar->avatar_path:null;
    }

    public function getCurrentLevelAttribute()
    {
        $challenge = Challenge::where('user_id',$this->id)
        ->orderByDesc('id')->first();

        if(!$challenge){
            return 1;
        }
        return $challenge->success_score >= 3
        ? $challenge->skill_id +1
        : $challenge->skill_id;
        ;
    }

    public function getCurrentAnimalAttribute()
    {
        $animal = Animal::where('required_level','<=',$this->current_level)
        ->orderByDesc('required_level')->first();

        return $animal ? $animal: null;
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

        if(!$challenge){
            return 0;
        }

        return $challenge->success_score >= 3
        ? $challenge->success_score=0
        : $challenge->success_score;
    }

    public function userItems()
    {
        return  UserItem::where('user_id',$this->id)->with('item')->get();
    }

    public function getEquippedItemPathAttribute(){
        return $this->userItems()->where('is_equipped',true)?->first()?->item?->avatar_path;
    }

}