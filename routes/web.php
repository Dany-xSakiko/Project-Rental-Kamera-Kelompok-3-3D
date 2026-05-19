<?php

use Illuminate\Support\Facades\Route;

// 1. Rute untuk Admin (Semua URL yang depannya /admin)
Route::prefix('admin')->group(function () {
    Route::get('/{any?}', function () {
        return view('admin');
    })->where('any', '.*');
});

// 2. Rute untuk Pelanggan (Website Utama, selain /admin)
Route::get('/{any?}', function () {
    return view('customer');
})->where('any', '.*');