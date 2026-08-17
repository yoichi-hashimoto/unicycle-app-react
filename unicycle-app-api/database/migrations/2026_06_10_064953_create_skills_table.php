<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('code', 16)->unique();
            $table->unsignedTinyInteger('level')->unique();
            $table->string('animal', 20);
            $table->string('level_label', 20);
            $table->string('name');
            $table->string('alternate_name')->nullable();
            $table->string('category', 20)->index();
            $table->string('performance_type', 20)->index();
            $table->string('skill_family', 40)->index();
            $table->text('promotion_test');
            $table->text('pass_criteria');
            $table->string('official_reference')->nullable();
            $table->unsignedSmallInteger('min_duration');
            $table->unsignedSmallInteger('default_duration');
            $table->unsignedSmallInteger('max_duration');
            $table->unsignedTinyInteger('showiness')->index();
            $table->unsignedTinyInteger('sync_load');
            $table->string('people', 20);
            $table->string('trajectory');
            $table->string('recommended_scene');
            $table->text('description')->nullable();
            $table->text('tips');
            $table->text('caution')->nullable();
            $table->string('evidence_type');
            $table->json('source_ids')->nullable();
            $table->string('avatar_path')->nullable();
            $table->string('movie_path')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $table->index(['category', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
