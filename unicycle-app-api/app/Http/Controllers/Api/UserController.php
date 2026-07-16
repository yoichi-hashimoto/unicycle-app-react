<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['avatar', 'color', 'userItems.item'])
            ->withCount('likes')
            ->get();
        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        return new UserResource($user->load(['avatar', 'color', 'userItems.item'])->loadCount('likes'));
        
    }

    public function store(Request $request)
    {
        $validated = $request ->validate([
            'name'=>['required','string','max:20'],
            'password'=>['required','string','min:8','confirmed'],
            'user_avatar_id'=>['required','integer','exists:user_avatars,id'],
            'color_id'=>['nullable','integer','exists:colors,id'],
            'login_id'=>['required','string','min:6','max:20','unique:users,login_id'],
        ]);
        
        $user = new User();

        $user->name = $validated['name'];
        $user->password = Hash::make($validated['password']);
        $user->login_id = $validated['login_id'];
        $user->user_avatar_id = $validated['user_avatar_id'];
        $user->color_id = $validated['color_id'];

       $user->save();

       return response()->json([
       'user'=>new UserResource($user),],201);
    }

    public function update(Request $request, User $user)
    {
       abort_unless($request->user()->id === $user->id || $request->user()->is_admin, 403);

       $validate = $request->validate([
        'name'=>['nullable','string','max:20'],
        'current_password'=>['nullable','required_with:password','current_password'],
        'password'=>['nullable','string','min:8','confirmed'],
        'user_avatar_id'=>['nullable','integer','exists:user_avatars,id'],
        'color_id'=>['nullable','integer','exists:colors,id'],
       ]);

       if(!empty($validate['name'])){
        $user->name = $validate['name'];
       }

       if(array_key_exists('user_avatar_id', $validate) && $validate['user_avatar_id'] !== null){
        $user->user_avatar_id = $validate['user_avatar_id'];
       }

       if(!empty($validate['password'])){
        $user->password = Hash::make($validate['password']);
       }

       if(array_key_exists('color_id', $validate)){
        $user->color_id = $validate['color_id'];
       }

       $user->save();

       $user->refresh()->load(['avatar', 'color', 'userItems.item'])->loadCount('likes');

       return new UserResource($user);
    }

    public function destroy(User $user)
    {
        abort_if(request()->user()->id === $user->id, 422, '自分自身は削除できません。');
        $user->delete();

        return response()->noContent();
    }
}
