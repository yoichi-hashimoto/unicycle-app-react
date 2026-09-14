<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Notice;

class NoticeController
{
    public function index(){
        return Notice::all();}

    public function store(Request $request){
        $validate = $request->validate([
            'title'=>'string|max:16',
            'text'=>'string|max:200',
        ]);

        $notice = new Notice;

        $notice->title = $validate['title'];
        $notice->text = $validate['text'];
    }
}
