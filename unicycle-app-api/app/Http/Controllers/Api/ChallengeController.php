<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Challenge;
use App\Http\Resources\ChallengeResource;

class ChallengeController extends Controller
{
        public function index()
    {
        return ChallengeResource::collection(
            Challenge::with([
                'skill',
                'likes',
                'user.avatar',
                'user.color',
                'user.userItems.item',
            ])->get()
        );
    }

    public function store(Request $request ,Challenge $challenge)
    {
        $validate = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'skill_id' => ['required', 'integer', 'exists:skills,id'],
            'success_score' => ['required', 'integer', 'between:0,3'],
        ]);

        $challenge->fill($validate)->save();

        return (new ChallengeResource($challenge->load(['user', 'skill', 'likes'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        
    }

    public function destroy($id)
    {
        
    }
}
