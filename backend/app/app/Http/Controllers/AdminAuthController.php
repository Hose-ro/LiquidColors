<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        if (session('admin_logged')) {
            return redirect()->route('admin.posts.index');
        }

        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = AdminUser::where('email', $request->email)->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            return back()->withErrors([
                'email' => 'Credenciales invalidas.',
            ])->withInput();
        }

        session([
            'admin_logged' => true,
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'admin_email' => $admin->email,
        ]);

        return redirect()->route('admin.posts.index');
    }

    public function logout()
    {
        session()->flush();

        return redirect()->route('admin.login');
    }
}
