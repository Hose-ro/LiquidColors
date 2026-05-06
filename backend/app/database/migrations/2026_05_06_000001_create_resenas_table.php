<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('nombre', 100)->nullable();
            $table->string('email', 180)->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('comentario');
            $table->boolean('aprobada')->default(false);
            $table->timestamps();

            $table->index('product_id');
            $table->index('aprobada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};
