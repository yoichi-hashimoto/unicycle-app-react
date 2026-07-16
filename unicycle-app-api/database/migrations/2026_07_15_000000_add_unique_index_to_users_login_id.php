<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasIndex('users', ['login_id'], 'unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unique('login_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasIndex('users', ['login_id'], 'unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique(['login_id']);
            });
        }
    }
};
