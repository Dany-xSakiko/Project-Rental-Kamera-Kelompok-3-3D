<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cameras', function (Blueprint $table) {
            $table->id();

            $table->string('brand', 50);

            $table->string('serial_number', 100)->unique();

            $table->string('type', 50)->nullable();

            $table->text('description')->nullable();

            $table->integer('stock')->default(0);

            $table->decimal('price_per_day', 10, 2)->nullable();

            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cameras');
    }
};