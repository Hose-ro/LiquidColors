<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PublicBlogController extends Controller
{
    public function feed(): JsonResponse
    {
        $baseQuery = Post::query()
            ->where('estado', 'publicado')
            ->orderByDesc('fecha')
            ->orderByDesc('id');

        $articles = (clone $baseQuery)
            ->where('tipo', 'articulo')
            ->get();

        $notices = (clone $baseQuery)
            ->where('tipo', 'noticia')
            ->get();

        $deliveries = (clone $baseQuery)
            ->where('tipo', 'pedido')
            ->get();

        return response()->json([
            'posts' => $articles->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->titulo,
                'excerpt' => $post->resumen,
                'content' => $post->contenido,
                'created_at' => $post->fecha,
                'tag' => 'Articulo',
            ])->values(),
            'notices' => $notices->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->titulo,
                'body' => $post->resumen ?: $post->contenido,
                'created_at' => $post->fecha,
                'tag' => 'Aviso',
            ])->values(),
            'deliveries' => $deliveries->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->titulo,
                'summary' => $post->resumen,
                'quantity' => $post->num_pedidos,
                'range' => $post->rango_fechas,
                'created_at' => $post->fecha,
            ])->values(),
        ]);
    }
}
