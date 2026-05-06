<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (blank($email) || blank($password)) {
            $this->command?->warn('ADMIN_EMAIL and ADMIN_PASSWORD are not configured; skipping admin user seed.');
            return;
        }

        AdminUser::updateOrCreate([
            'email' => $email,
        ], [
            'name' => env('ADMIN_NAME', 'Administrador'),
            'password' => Hash::make($password),
        ]);
    }
}
