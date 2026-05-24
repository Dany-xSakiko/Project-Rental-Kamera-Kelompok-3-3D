<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RentalController; // ← tambah ini

// Katalog
Route::get('/katalog-produk', function () {
    $cameras = DB::table('cameras')->get();
    $equipments = DB::table('equipments')->get();
    return response()->json([
        'cameras' => $cameras,
        'equipments' => $equipments,
    ]);
});

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route yang butuh login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/rentals', [RentalController::class, 'store']); // ← tambah ini
});