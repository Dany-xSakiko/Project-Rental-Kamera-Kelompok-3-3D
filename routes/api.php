<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RentalController; // ← tambah ini
use App\Http\Controllers\Api\CameraController;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;


// Katalog
Route::get('/katalog-produk', function () {
    $cameras = DB::table('cameras')->get();
    $equipments = DB::table('equipments')->get();
    return response()->json([
        'cameras' => $cameras,
        'equipments' => $equipments,
    ]);
});

//Katalog Kamera (Kita arahkan ke index CameraController agar fitur SEARCH & FILTER aktif)
Route::get('/cameras', [CameraController::class, 'index']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        // Hapus token lama untuk keamanan
        $user->tokens()->delete();

        // Buat token Sanctum yang valid
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Berhasil',
            'token' => $token, // Token ini sekarang dikenali oleh middleware
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'admin'
            ]
        ], 200);
    }

    return response()->json(['message' => 'Email atau Password salah!'], 401);
});


// Route yang butuh login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/rentals', [RentalController::class, 'store']); // ← tambah ini

        // Management Rental untuk Admin
    Route::get('/admin/rentals', [RentalController::class, 'index']);
    Route::put('/admin/rentals/{id}/status', [RentalController::class, 'updateStatus']);
});

// ✦ ENDPOINT UTAMA DASHBOARD ADMIN ✦
Route::get('/admin/dashboard-stats', function () {
    try {
        // 1. Ambil data booking secara kasaran tanpa JOIN dulu
        $rentals = DB::table('rentals')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        // 2. Kita petakan datanya secara manual agar nama pelanggan aman
        $bookingTerbaru = $rentals->map(function ($item) {
            $user = DB::table('users')->where('id', $item->user_id)->first();

            $namaBarang = 'Kamera';
            if (isset($item->nama_barang)) {
                $namaBarang = $item->nama_barang;
            } elseif (isset($item->camera_name)) {
                $namaBarang = $item->camera_name;
            }

            return [
                'id' => $item->id,
                'pelanggan_nama' => $user ? $user->name : 'Guest/Member',
                'nama_barang' => $namaBarang,
                'start_date' => $item->start_date ?? $item->tanggal_sewa ?? '-',
                'end_date' => $item->end_date ?? '',
                'status' => $item->status ?? 'Pending',
                'total_price' => $item->total_price ?? $item->total_harga ?? 0,
            ];
        });

        // 3. Ambil statistik atas dengan pengaman try-catch internal
        $totalBarang = 0;
        try {
            $totalBarang = DB::table('cameras')->count();
        } catch (\Exception $e) {
            /* abaikan jika tabel salah */
        }

        $sedangDisewa = DB::table('rentals')->where('status', 'Aktif / Disewa')->count();
        $menungguPickup = DB::table('rentals')->where('status', 'Menunggu Pickup')->count();
        $pendapatan = DB::table('rentals')->sum('total_price' ?? 'total_harga' ?? 0);

        return response()->json([
            'total_barang' => $totalBarang,
            'sedang_disewa' => $sedangDisewa,
            'menunggu_pickup' => $menungguPickup,
            'pendapatan' => $pendapatan ? (int) $pendapatan : 0,
            'booking_terbaru' => $bookingTerbaru
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Database Error',
            'message' => $e->getMessage()
        ], 500);
    }
});


// ✦ TAMBAHKAN INI UNTUK MENU PELANGGAN ✦
Route::get('/admin/pelanggan', function () {
    try {
        $users = DB::table('users')->orderBy('id', 'desc')->get();
        return response()->json($users, 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Gagal mengambil data pelanggan',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Resource individual kamera untuk keperluan CRUD Admin
Route::put('/cameras/{id}', [CameraController::class, 'update']);
Route::apiResource('cameras', CameraController::class);