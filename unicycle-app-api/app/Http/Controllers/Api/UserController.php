<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UsersResource;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users=User::all();    
        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        return new UserResource($user);
        
    }

    public function store(Request $request)
    {
        
    }

    public function update(Request $request, User $user)
    {
       $validate = $request ->validate([
        'name'=>['nullable','string','max:255'],
        'password'=>['nullable','string','min:8','confirmed'],
        'user_avatar_id'=>['integer'],
        'background_color'=>['nullable','string'],
       ]);

       if(!empty($validate['name'])){
        $user->name = $validate['name'];
       }

       if(!empty($validate['user_avatar_id'])){
        $user->user_avatar_id = $validate['user_avatar_id'];
       }

       if(!empty($validate['password'])){
        $user->password = Hash::make($validate['password']);
       }

       if(!empty($validate['background_color'])){
        $user->background_color = $validate['background_color'];
       }

       $user->save();

       return response()->json([
        'message'=>'プロフィールを更新しました',
        'data'=>$user->fresh(),
       ]);
    }

    public function destroy($id)
    {
        
    }
}
