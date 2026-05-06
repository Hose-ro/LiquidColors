<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminUser extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];

    public function posts(){
        return $this->hasMany(Post::class, 'admin_id');
    }
}
