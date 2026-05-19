<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/katalog-produk', function () {
    // Ambil data kamera
    $cameras = DB::table('cameras')->get();
    
    // Ambil data equipment
    $equipments = DB::table('equipments')->get();
    
    // Gabungkan dan kirim ke React dalam format JSON
    return response()->json([
        'cameras' => $cameras,
        'equipments' => $equipments
    ]);
});