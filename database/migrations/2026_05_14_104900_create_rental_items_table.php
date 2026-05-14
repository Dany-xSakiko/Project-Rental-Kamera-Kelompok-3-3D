<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('equipment_id')
                ->constrained('equipments')
                ->onDelete('cascade');

            $table->integer('quantity')->default(1);

            $table->decimal('subtotal', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_items');
    }
};