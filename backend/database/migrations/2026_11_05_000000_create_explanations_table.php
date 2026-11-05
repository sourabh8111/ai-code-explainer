<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explanations', function (Blueprint $table) {
            $table->id();
            $table->string('language', 20);
            $table->longText('code');
            $table->text('explanation');
            $table->json('key_logic')->nullable();
            $table->string('time_complexity')->nullable();
            $table->string('space_complexity')->nullable();
            $table->text('complexity_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explanations');
    }
};
