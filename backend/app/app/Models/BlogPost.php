<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = ['blog_category', 'title', 'content', 'image',];

    public function category()
    {
        return $this->belongsTo(BlogCategory::class);
    }
}
