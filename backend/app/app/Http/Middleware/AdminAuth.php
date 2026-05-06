<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        if (!session()->has('admin_logged') || session('admin_logged') !== true) {
            return redirect('/admin/login');
        }

        return $next($request);
    }
}