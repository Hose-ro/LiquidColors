<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'admin_id',
        'titulo',
        'resumen',
        'contenido',
        'tipo',
        'estado',
        'num_pedidos',
        'rango_fechas',
        'fecha',
    ];

    public function admin(){
        return $this->belongsTo(AdminUser::class, 'admin_id');
    }
}


