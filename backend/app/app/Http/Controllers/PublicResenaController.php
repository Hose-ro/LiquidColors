<?php

namespace App\Http\Controllers;

use App\Models\Resena;
use Illuminate\Http\Request;

class PublicResenaController extends Controller
{
    public function index($productId)
    {
        $resenas = Resena::where('product_id', $productId)
            ->where('aprobada', true)
            ->orderByDesc('created_at')
            ->get(['id', 'nombre', 'rating', 'comentario', 'created_at']);

        $total = $resenas->count();
        $promedio = $total > 0 ? round($resenas->avg('rating'), 1) : 0;

        $distribucion = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribucion[$i] = $resenas->where('rating', $i)->count();
        }

        return response()->json([
            'resenas'     => $resenas,
            'promedio'    => $promedio,
            'total'       => $total,
            'distribucion' => $distribucion,
        ]);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating'     => 'required|integer|min:1|max:5',
            'comentario' => 'required|string|min:5|max:1000',
            'nombre'     => 'nullable|string|max:100',
            'email'      => 'nullable|email|max:180',
        ]);

        Resena::create([
            'product_id' => $productId,
            'nombre'     => $request->nombre,
            'email'      => $request->email,
            'rating'     => $request->rating,
            'comentario' => $request->comentario,
        ]);

        return response()->json([
            'message' => 'Tu reseña fue enviada y está pendiente de aprobación.',
        ], 201);
    }
}
