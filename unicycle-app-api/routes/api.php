<?php

use App\Http\Controllers\Api\ChallengeController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AvatarController;
use App\Http\Controllers\Api\Controller;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::apiResource('users', UserController::class);
Route::apiResource('challenges', ChallengeController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('likes', LikeController::class);
Route::apiResource('animals', AnimalController::class);
Route::apiResource('avatars', AvatarController::class);

Route::patch('/users/{user}',[UserController::class,'update']);
// Route::store('/challenge',[LikeController::class],'store');

Route::middleware('auth:sanctum')->get('/user',function(Request $request){
    return $request->user();
});