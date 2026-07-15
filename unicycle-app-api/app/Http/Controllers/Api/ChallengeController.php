<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Challenge;
use App\Http\Resources\ChallengeResource;

class ChallengeController extends Controller
{
        public function index()
    {
        return ChallengeResource::collection(Challenge::with(['user', 'skill', 'likes'])->get());
    }

    public function store(Request $request ,Challenge $challenge)
    {
        $validate = $request->validate([
            'user_id' => ["integer"],
            'current_level' =>["integer"],
            'success_score' => ["integer"],
        ]);

        if(!empty($validate['user_id'])){
            $challenge->user_id = $validate['user_id'];
        }

        if(!empty($validate['current_level'])){
            $challenge->skill_id = $validate['current_level'];
        }

        if(!empty($validate['success_score'])){
            $challenge->success_score = $validate['success_score'];
        }

        $challenge ->save();
    }

    public function update(Request $request, $id)
    {
        
    }

    public function destroy($id)
    {
        
    }
}
