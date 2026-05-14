<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('equipment_category_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('name', 100);

            $table->string('brand', 50)->nullable();

            $table->text('specification')->nullable();

            $table->integer('stock')->default(0);

            $table->decimal('price_per_day', 10, 2)->nullable();

            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};