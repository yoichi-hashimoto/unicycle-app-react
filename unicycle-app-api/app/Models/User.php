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

#[Fillable(['name', 'login_id', 'password', 'user_avatar_id', 'color_id'])]
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
            'login_id'=>'string',
            'user_avatar_id' =>'integer',
            'password' => 'hashed',
            'is_admin' =>'boolean',
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

    public function color(){
        return $this->belongsTo(Color::class);
    }

    public function avatar(){
        return $this->belongsTo(UserAvatar::class, 'user_avatar_id');
    }

    public function getColorPathAttribute(){
        return $this->color?->color_path;
    }

    public function getAvatarPathAttribute(){
        return $this->avatar?->avatar_path;
    }

    public function getCurrentLevelAttribute()
    {
        $challenge = Challenge::where('user_id',$this->id)
        ->orderByDesc('id')->first();

        if(!$challenge){
            return 1;
        }
        $level = $challenge->skill?->level ?? 1;

        return $challenge->success_score >= 3 ? $level + 1 : $level;
    }

    public function getCurrentAnimalAttribute()
    {
        $animal = Animal::where('required_level','<=',$this->current_level)
        ->orderByDesc('required_level')->first();

        return $animal ? $animal: null;
    }

    public function getReceivedLikesAttribute()
    {
        return $this->likes_count ?? $this->likes()->count();
    }

    public function getRemainLevelAttribute()
    {
            return 6 - ( $this->current_level % 5);
        }


    public function getSkillNameAttribute(){
        return Skill::where('level',$this->current_level)->value('name');
    }

    public function getCurrentSkillIdAttribute(){
        return Skill::where('level', $this->current_level)->value('id');
    }

    public function getSuccessScoreAttribute(){
        $challenge = Challenge::where('user_id',$this->id)
        ->latest()->first();

        if(!$challenge){
            return 0;
        }

        return $challenge->success_score >= 3 ? 0 : $challenge->success_score;
    }

    public function userItems()
    {
        return $this->hasMany(UserItem::class);
    }

    public function getEquippedItemPathAttribute(){
        $userItem = $this->relationLoaded('userItems')
            ? $this->userItems->firstWhere('is_equipped', true)
            : $this->userItems()->with('item')->where('is_equipped', true)->first();

        return $userItem?->item?->avatar_path;
    }

}
