<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('reservations')) {
            Schema::create('reservations', static function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id');
                $table->foreignId('book_id');
                $table->date('reservation_date');
                $table->enum('status', ['pending', 'approved', 'cancelled'])->default('pending');
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
