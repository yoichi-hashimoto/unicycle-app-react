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

    public function store(Request $request)
    {
        
    }

    public function update(Request $request, $id)
    {
        
    }

    public function destroy($id)
    {
        
    }
}
