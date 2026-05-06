<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PublicBlogFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_blog_feed_returns_only_published_posts_grouped_by_type(): void
    {
        $admin = AdminUser::create([
            'name' => 'Administrador',
            'email' => 'blog@test.com',
            'password' => Hash::make('test-password'),
        ]);

        Post::create([
            'admin_id' => $admin->id,
            'titulo' => 'Aviso importante',
            'resumen' => 'Resumen aviso',
            'contenido' => 'Contenido aviso',
            'tipo' => 'noticia',
            'estado' => 'publicado',
            'fecha' => '2026-04-01',
        ]);

        Post::create([
            'admin_id' => $admin->id,
            'titulo' => 'Articulo del dia',
            'resumen' => 'Resumen articulo',
            'contenido' => 'Contenido articulo',
            'tipo' => 'articulo',
            'estado' => 'publicado',
            'fecha' => '2026-04-02',
        ]);

        Post::create([
            'admin_id' => $admin->id,
            'titulo' => 'Entregas semanales',
            'resumen' => 'Resumen pedidos',
            'contenido' => 'Contenido pedidos',
            'tipo' => 'pedido',
            'estado' => 'publicado',
            'num_pedidos' => 12,
            'rango_fechas' => '01 abr - 07 abr',
            'fecha' => '2026-04-03',
        ]);

        Post::create([
            'admin_id' => $admin->id,
            'titulo' => 'Borrador oculto',
            'resumen' => 'No debe salir',
            'contenido' => 'No debe salir',
            'tipo' => 'articulo',
            'estado' => 'borrador',
            'fecha' => '2026-04-04',
        ]);

        $this->getJson('/api/public/blog-feed')
            ->assertOk()
            ->assertJsonCount(1, 'notices')
            ->assertJsonCount(1, 'posts')
            ->assertJsonCount(1, 'deliveries')
            ->assertJsonPath('notices.0.title', 'Aviso importante')
            ->assertJsonPath('posts.0.title', 'Articulo del dia')
            ->assertJsonPath('deliveries.0.title', 'Entregas semanales')
            ->assertJsonPath('deliveries.0.quantity', 12);
    }
}
