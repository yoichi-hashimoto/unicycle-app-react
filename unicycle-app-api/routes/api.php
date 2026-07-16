<?php

use App\Http\Controllers\Api\ChallengeController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AvatarController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\UserItemController;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

Route::get('users', [UserController::class, 'index']);
Route::get('users/{user}', [UserController::class, 'show']);
Route::get('skills', [SkillController::class, 'index']);
Route::get('animals', [AnimalController::class, 'index']);
Route::get('avatars', [AvatarController::class, 'index']);
Route::get('colors', [ColorController::class, 'index']);
Route::get('items', [ItemController::class, 'index']);
Route::get('challenges',[ChallengeController::class,'index']);

Route::middleware('auth:sanctum')->group(function(){
    Route::patch('/users/{user}',[UserController::class,'update']);
    Route::patch('/user_item/{userItem}',[UserItemController::class,'update']);
    Route::post('likes', [LikeController::class, 'store']);
    Route::get('/user',function(Request $request){
        return response()->json([
            'user'=>new UserResource(
                $request->user()->load(['avatar', 'color', 'userItems.item'])->loadCount('likes')
            ),
        ]);
    });

    Route::middleware('admin')->group(function(){
        Route::post('users', [UserController::class, 'store']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::post('challenges',[ ChallengeController::class,'store']);
    });
});
