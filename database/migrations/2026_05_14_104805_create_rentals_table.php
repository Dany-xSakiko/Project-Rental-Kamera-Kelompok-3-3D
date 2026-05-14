<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('camera_id')
                ->constrained()
                ->onDelete('cascade');

            $table->date('rent_date');

            $table->date('return_due');

            $table->date('return_date')->nullable();

            $table->decimal('total_price', 10, 2)->default(0);

            $table->decimal('fine', 10, 2)->default(0);

            $table->enum('status', [
                'pending',
                'borrowed',
                'returned'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};                                                                                                                                              