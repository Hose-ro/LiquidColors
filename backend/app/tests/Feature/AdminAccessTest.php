<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_page_is_available(): void
    {
        $this->get('/admin/login')
            ->assertOk();
    }

    public function test_guest_is_redirected_from_admin_posts(): void
    {
        $this->get('/admin/posts')
            ->assertRedirect('/admin/login');
    }

    public function test_admin_can_log_in_with_valid_credentials(): void
    {
        $loginFixture = 'fixture-login-value';

        AdminUser::create([
            'name' => 'Administrador',
            'email' => 'admin@test.com',
            'password' => Hash::make($loginFixture),
        ]);

        $this->post('/admin/login', [
            'email' => 'admin@test.com',
            'password' => $loginFixture,
        ])->assertRedirect('/admin/posts');

        $this->assertTrue(session('admin_logged'));
    }
}
