<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\CameraController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\EquipmentCategoryController;
use App\Http\Controllers\Api\RentalItemController;

// Katalog produk umum
Route::get('/katalog-produk', function () {
    $cameras = DB::table('cameras')->get();
    $equipments = DB::table('equipments')->get();

    return response()->json([
        'cameras' => $cameras,
        'equipments' => $equipments,
    ]);
});

// Auth (publik)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'loginAdmin']);

// Katalog publik - bisa dibaca semua
Route::get('/cameras', [CameraController::class, 'index']);
Route::get('/cameras/{id}', [CameraController::class, 'show']);

// Route yang harus login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // CRUD kamera - hanya admin
    Route::post('/cameras', [CameraController::class, 'store']);
    Route::put('/cameras/{id}', [CameraController::class, 'update']);
    Route::delete('/cameras/{id}', [CameraController::class, 'destroy']);

    // Checkout user
    Route::post('/rentals', [RentalController::class, 'store']);

    // History / detail rental untuk user/admin
    Route::get('/rentals', [RentalController::class, 'index']);
    Route::get('/rentals/{id}', [RentalController::class, 'show']);
    Route::delete('/rentals/{id}', [RentalController::class, 'destroy']);

    // Admin rental management
    Route::get('/admin/rentals', [RentalController::class, 'index']);
    Route::put('/admin/rentals/{id}/status', [RentalController::class, 'updateStatus']);

    // CRUD equipments / kategori / rental item
    Route::apiResource('equipments', EquipmentController::class);
    Route::apiResource('equipment-categories', EquipmentCategoryController::class);
    Route::apiResource('rental-items', RentalItemController::class);

    // Admin dashboard / pelanggan
    Route::get('/admin/dashboard-stats', function () {
        try {
            $rentals = DB::table('rentals')
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get();

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

            $totalBarang = 0;
            try {
                $totalBarang = DB::table('cameras')->count() + DB::table('equipments')->count();
            } catch (\Exception $e) {
                // abaikan jika tabel salah
            }

            $sedangDisewa = DB::table('rentals')->where('status', 'Aktif / Disewa')->count();
            $menungguPembayaran = DB::table('rentals')->where('status', 'Menunggu Pembayaran')->count();
            $pendapatan = DB::table('rentals')->sum('total_price' ?? 'total_harga' ?? 0);

            return response()->json([
                'total_barang' => $totalBarang,
                'sedang_disewa' => $sedangDisewa,
                'menunggu_pembayaran' => $menungguPembayaran,
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

    Route::put('/profile', [ProfileController::class, 'update']);
});

