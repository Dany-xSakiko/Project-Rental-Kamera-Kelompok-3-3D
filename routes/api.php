<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RentalController; // ← tambah ini
use App\Http\Controllers\Api\CameraController;

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
Route::post('/login', [AuthController::class, 'login']);

// Route yang butuh login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/rentals', [RentalController::class, 'store']); // ← tambah ini
});