<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('posts', function (Blueprint $table) {
        $table->id();

        $table->unsignedBigInteger('admin_id'); // autor del post
        
        $table->string('titulo');
        $table->string('resumen')->nullable();
        $table->text('contenido')->nullable();

        $table->enum('tipo', ['noticia', 'articulo', 'pedido'])
              ->default('noticia');

        $table->enum('estado', ['publicado', 'borrador'])
              ->default('publicado');

        // Para pedidos
        $table->integer('num_pedidos')->nullable();
        $table->string('rango_fechas')->nullable();

        $table->date('fecha');
        
        $table->timestamps();

        $table->foreign('admin_id')
              ->references('id')->on('admin_users')
              ->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
