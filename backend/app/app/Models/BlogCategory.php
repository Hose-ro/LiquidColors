<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogCategory extends Model
{
    protected $fillable = ['name'];

    public function posts()
    {
        return $this->hasMany(BlogPost::class);
    }
}
