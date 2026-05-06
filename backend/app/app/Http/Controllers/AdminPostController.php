<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminPostController extends Controller
{
    public function index(): View
    {
        $posts = Post::orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return view('admin.blog', compact('posts'));
    }

    public function listJson()
    {
        return response()->json(
            Post::orderByDesc('fecha')
                ->orderByDesc('id')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:120',
            'fecha' => 'required|date',
            'tipo' => 'required|in:noticia,articulo,pedido',
            'estado' => 'required|in:publicado,borrador',
        ]);

        $post = Post::create([
            'admin_id' => session('admin_id'),
            'titulo' => $request->titulo,
            'resumen' => $request->resumen,
            'contenido' => $request->contenido,
            'tipo' => $request->tipo,
            'estado' => $request->estado,
            'num_pedidos' => $request->num_pedidos,
            'rango_fechas' => $request->rango_fechas,
            'fecha' => $request->fecha,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Publicacion creada correctamente.',
                'post' => $post,
            ], 201);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Publicacion creada correctamente.');
    }

    public function show($id)
    {
        return response()->json(
            Post::findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo' => 'required|string|max:128',
            'fecha' => 'required|date',
            'tipo' => 'required|in:noticia,articulo,pedido',
            'estado' => 'required|in:publicado,borrador',
        ]);

        $post = Post::findOrFail($id);

        $post->update([
            'titulo' => $request->titulo,
            'resumen' => $request->resumen,
            'contenido' => $request->contenido,
            'tipo' => $request->tipo,
            'estado' => $request->estado,
            'num_pedidos' => $request->num_pedidos,
            'rango_fechas' => $request->rango_fechas,
            'fecha' => $request->fecha,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Publicacion actualizada correctamente.',
                'post' => $post->fresh(),
            ]);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Publicacion actualizada correctamente.');
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Publicacion eliminada correctamente.',
            ]);
        }

        return redirect()->route('admin.posts.index')->with('success', 'Publicacion eliminada correctamente.');
    }
}
