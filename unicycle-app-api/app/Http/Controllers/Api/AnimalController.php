<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Animal;

class AnimalController extends Controller
{
        public function index()
    {
        return Animal::orderBy('required_level')->get();
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
