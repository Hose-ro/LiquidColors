<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminPostController;
use App\Http\Controllers\AdminResenaController;
use App\Http\Controllers\PublicBlogController;
use App\Http\Controllers\PublicResenaController;

Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
Route::get('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// API pública — blog
Route::get('/api/public/blog-feed', [PublicBlogController::class, 'feed'])
    ->name('public.blog.feed');

// API pública — reseñas de productos
Route::get('/api/public/productos/{productId}/resenas', [PublicResenaController::class, 'index'])
    ->name('public.resenas.index');
Route::post('/api/public/productos/{productId}/resenas', [PublicResenaController::class, 'store'])
    ->name('public.resenas.store');

Route::middleware('admin.auth')->prefix('admin')->group(function () {
    Route::get('/dashboard', fn () => redirect()->route('admin.posts.index'))->name('admin.dashboard');
    Route::get('/blog', fn () => redirect()->route('admin.posts.index'))->name('admin.blog');

    // Blog posts
    Route::get('/posts', [AdminPostController::class, 'index'])->name('admin.posts.index');
    Route::get('/posts-json', [AdminPostController::class, 'listJson'])->name('admin.posts.json');
    Route::post('/posts', [AdminPostController::class, 'store'])->name('admin.posts.store');
    Route::get('/posts/{id}', [AdminPostController::class, 'show'])->name('admin.posts.show');
    Route::put('/posts/{id}', [AdminPostController::class, 'update'])->name('admin.posts.update');
    Route::delete('/posts/{id}', [AdminPostController::class, 'destroy'])->name('admin.posts.delete');

    // Reseñas
    Route::get('/resenas', [AdminResenaController::class, 'index'])->name('admin.resenas.index');
    Route::get('/resenas-json', [AdminResenaController::class, 'listJson'])->name('admin.resenas.json');
    Route::patch('/resenas/{id}/aprobar', [AdminResenaController::class, 'aprobar'])->name('admin.resenas.aprobar');
    Route::patch('/resenas/{id}/rechazar', [AdminResenaController::class, 'rechazar'])->name('admin.resenas.rechazar');
    Route::delete('/resenas/{id}', [AdminResenaController::class, 'destroy'])->name('admin.resenas.destroy');
});
