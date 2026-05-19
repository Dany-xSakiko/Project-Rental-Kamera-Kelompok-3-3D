<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class RentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // 1. Buat Dummy Data Pelanggan (Users)
        DB::table('users')->insert([
            [
                'name' => 'Yuki Rentaka', 
                'email' => 'yuki@email.com', 
                'password' => Hash::make('password123'), // Password wajib di-hash
                'created_at' => $now, 
                'updated_at' => $now
            ],
            [
                'name' => 'Budi Santoso', 
                'email' => 'budi@email.com', 
                'password' => Hash::make('password123'), 
                'created_at' => $now, 
                'updated_at' => $now
            ],
        ]);

        // 2. Buat Dummy Data Kamera (Cameras)
        DB::table('cameras')->insert([
            [
                'brand' => 'Sony', 
                'serial_number' => 'SN-A7IV-001', 
                'type' => 'Mirrorless', 
                'description' => 'Kamera mirrorless full-frame flagship Sony dengan sensor 33MP.', 
                'stock' => 5, 
                'price_per_day' => 250000, 
                'created_at' => $now, 
                'updated_at' => $now
            ],
            [
                'brand' => 'Canon', 
                'serial_number' => 'SN-R5-001', 
                'type' => 'Mirrorless', 
                'description' => 'Flagship mirrorless Canon dengan resolusi 45MP dan video 8K.', 
                'stock' => 2, 
                'price_per_day' => 300000, 
                'created_at' => $now, 
                'updated_at' => $now
            ],
        ]);

        // 3. Buat Dummy Kategori Peralatan (Equipment Categories)
        // Kita simpan ID-nya untuk disambungkan ke tabel Equipments
        $catLensa = DB::table('equipment_categories')->insertGetId(['name' => 'Lensa', 'created_at' => $now, 'updated_at' => $now]);
        $catLighting = DB::table('equipment_categories')->insertGetId(['name' => 'Lighting', 'created_at' => $now, 'updated_at' => $now]);

        // 4. Buat Dummy Peralatan (Equipments / Aksesoris)
        DB::table('equipments')->insert([
            [
                'equipment_category_id' => $catLensa, 
                'name' => 'Sony 24-70mm f/2.8 GM II', 
                'brand' => 'Sony', 
                'specification' => 'Lensa Zoom Standard, Filter 82mm', 
                'stock' => 3, 
                'price_per_day' => 150000, 
                'created_at' => $now, 
                'updated_at' => $now
            ],
            [
                'equipment_category_id' => $catLighting, 
                'name' => 'Godox Softbox 60x60', 
                'brand' => 'Godox', 
                'specification' => 'Lighting softbox studio lengkap', 
                'stock' => 10, 
                'price_per_day' => 50000, 
                'created_at' => $now, 
                'updated_at' => $now
            ],
        ]);

        // 5. Buat Dummy Transaksi / Booking
        $rental1 = DB::table('rentals')->insertGetId([
            'booking_code' => '#YK2026051',
            'user_id' => 2, // ID milik Yuki
            'start_date' => '2026-05-15',
            'end_date' => '2026-05-17',
            'total_days' => 3,
            'total_price' => 750000,
            'status' => 'Aktif / Disewa',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $rental2 = DB::table('rentals')->insertGetId([
            'booking_code' => '#YK2026052',
            'user_id' => 3, // ID milik Budi
            'start_date' => '2026-05-18',
            'end_date' => '2026-05-20',
            'total_days' => 3,
            'total_price' => 900000,
            'status' => 'Menunggu Pembayaran',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        // 6. Buat Dummy Detail Barang yang disewa
        DB::table('rental_items')->insert([
            // Yuki menyewa Sony Alpha (Camera ID 1)
            ['rental_id' => $rental1, 'camera_id' => 1, 'equipment_id' => null, 'price_per_day' => 250000, 'created_at' => $now, 'updated_at' => $now],
            // Budi menyewa Canon EOS R5 (Camera ID 2)
            ['rental_id' => $rental2, 'camera_id' => 2, 'equipment_id' => null, 'price_per_day' => 300000, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}