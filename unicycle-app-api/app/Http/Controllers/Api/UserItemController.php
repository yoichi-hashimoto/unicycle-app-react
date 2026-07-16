<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\UserItem;
use Illuminate\Support\Facades\DB;

class UserItemController
{
    public function update(UserItem $userItem){
        $user = auth()->user();

        abort_unless($userItem->user_id === $user->id, 403, 'このアイテムは変更できません。');

        DB::transaction (function()use($user,$userItem){
            UserItem::where('user_id',$user->id)
            ->update([
                'is_equipped'=>false,
            ]);

            $userItem ->update([
                'is_equipped'=>true,
            ]);
        });
        return response()->json([
            'message' => 'アイテムを装備しました',
            'user_item'=>$userItem->fresh('item'),
        ]);
    }
}
