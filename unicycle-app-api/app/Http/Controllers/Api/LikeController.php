<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request-> validate([
            'challenge_id' => ['required', 'integer', 'exists:challenges,id'],
        ]);

        $challenge = \App\Models\Challenge::findOrFail($validated['challenge_id']);
        $like = Like::firstOrCreate([
            'challenge_id' => $challenge->id,
            'from_user_id' => $request->user()->id,
        ], [
            'user_id' => $challenge->user_id,
        ]);

        return response()->json(['like' => $like], $like->wasRecentlyCreated ? 201 : 200);
    }
}
