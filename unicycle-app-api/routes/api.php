<?php

use App\Http\Controllers\Api\ChallengeController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AvatarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\Controller;
use App\Http\Controllers\Api\UserItemController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Http\Request;

Route::apiResource('users', UserController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('animals', AnimalController::class);
Route::apiResource('avatars', AvatarController::class);
Route::apiResource('colors',ColorController::class);
Route::apiResource('items', ItemController::class);
Route::get('challenges',[ChallengeController::class,'index']);

Route::middleware('auth:sanctum')->group(function(){
    Route::apiResource('likes', LikeController::class);
    Route::patch('/users/{user}',[UserController::class,'update']);
    Route::patch('/user_item/{userItem}',[UserItemController::class,'update']);
    Route::get('/user',function(Request $request){
        return response()->json([
            'user'=>new UserResource($request->user()),
        ]);
});

Route::middleware('auth:sanctum','admin')->group(function(){
        Route::post('challenges',[ ChallengeController::class,'store']);
});
});