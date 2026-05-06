<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    protected $table = 'resenas';

    protected $fillable = [
        'product_id',
        'nombre',
        'email',
        'rating',
        'comentario',
        // 'aprobada' no está aquí para que el frontend público no pueda modificarla
    ];

    protected $casts = [
        'aprobada' => 'boolean',
        'rating'   => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
