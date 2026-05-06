<?php

namespace App\Http\Controllers;

use App\Models\Resena;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminResenaController extends Controller
{
    public function index(): View
    {
        return view('admin.resenas');
    }

    public function listJson()
    {
        $resenas = Resena::orderByDesc('created_at')
            ->get(['id', 'product_id', 'nombre', 'email', 'rating', 'comentario', 'aprobada', 'created_at']);

        return response()->json($resenas);
    }

    public function aprobar($id)
    {
        $resena = Resena::findOrFail($id);
        $resena->update(['aprobada' => true]);

        return response()->json(['message' => 'Reseña aprobada.', 'resena' => $resena->fresh()]);
    }

    public function rechazar($id)
    {
        $resena = Resena::findOrFail($id);
        $resena->update(['aprobada' => false]);

        return response()->json(['message' => 'Reseña rechazada.', 'resena' => $resena->fresh()]);
    }

    public function destroy(Request $request, $id)
    {
        $resena = Resena::findOrFail($id);
        $resena->delete();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Reseña eliminada.']);
        }

        return redirect()->route('admin.resenas.index')->with('success', 'Reseña eliminada.');
    }
}
