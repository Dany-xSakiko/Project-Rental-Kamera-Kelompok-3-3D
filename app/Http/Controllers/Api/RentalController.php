<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use App\Models\Equipment; // baru
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RentalController extends Controller
{
    /**
     * Display a listing of rentals.
     */
    public function index()
    {
        $rentals = Rental::with([
            'user',
            'rentalItems.camera',
            'rentalItems.equipment'
        ])->latest()->get();

        return response()->json($rentals);
    }

    /*Store a newly created rental from checkout.*/

    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'items'=> 'required|array|min:1',
            'items.*.camera_id' => 'nullable|integer',
            'items.*.equipment_id' => 'nullable|integer',
            'items.*.price_per_day' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Hitung total hari otomatis pakai Carbon
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $totalDays = $startDate->diffInDays($endDate);

        // Buat booking code unik
        $bookingCode = 'YK-' . strtoupper(\Illuminate\Support\Str::random(8));

        // Memulai DB Transaction demi keamanan data stok dan nota transaksi
        DB::beginTransaction();

        try {
            $grossTotalPrice = 0;
            $itemsToSave = [];

            // logika kalkulasi harga item dan pengurangan stok barang
            foreach ($request->items as $item){
                if (!empty($item['camera_id'])){
                    $product = Camera::lockForUpdate()->find($item['camera_id']);
                } else {
                    $product = Equipment::lockForUpdate()->find($item['equipment_id']);
                }

                // Cek ketersediaan stok di database 
                if (!$product || $product->stock < $item['quantity']) {
                    throw new \Exception("Stok untuk '" . ($product->name ?? $product->brand) . "' tidak mencukupi!");
                }

                // Potong stok barang otomatis
                $product->decrement('stock', $item['quantity']);

                // RUMUS UTAMA: (Harga Per Hari * Kuantitas) * Total Hari
                $itemTotalPrice = ($item['price_per_day'] * $item['quantity']) * $totalDays;
                $grossTotalPrice += $itemTotalPrice;

                $itemsToSave[] = [
                    'camera_id' => $item['camera_id'] ?? null,
                    'equipment_id' => $item['equipment_id'] ?? null,
                    'price_per_day' => $item['price_per_day'],
                    'quantity' => $item['quantity'],
                    'total_price' => $itemTotalPrice
                ];
            }

            // Simpan ke tabel rentals
            $rental = Rental::create([
                'booking_code' => $bookingCode,
                'user_id' => $request->user()->id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'total_days' => $totalDays,
                'total_price' => $grossTotalPrice,
                'status' => 'Aktif / Disewa',
            ]);

              // Simpan items ke tabel rental_items
            foreach ($itemsToSave as $itemData) {
                \App\Models\RentalItem::create([
                    'rental_id' => $rental->id,
                    'camera_id' => $itemData['camera_id'] ?? null,
                    'equipment_id' => $itemData['equipment_id'] ?? null,
                    'price_per_day' => $itemData['price_per_day'],
                    'quantity' => $itemData['quantity'],
                    'total_price' => $itemData['total_price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Booking berhasil!',
                'booking_code' => $bookingCode,
                'rental' => $rental->load('rentalItems.camera', 'rentalItems.equipment'),
                'rincian_nota' => [
                    'durasi' => $totalDays . ' Hari',
                    'total_akhir_wajib_bayar' => $grossTotalPrice
                ]
            ], 201);
            
        } catch (\Exception $e) {
            // Jika ada yang error atau stok kosong, kembalikan data stok awal semula
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified rental.
     */
    public function show(string $id)
    {
        $rental = Rental::with([
            'user',
            'rentalItems.camera',
            'rentalItems.equipment'
        ])->findOrFail($id);

        return response()->json($rental);
    }

    /**
     * Update the specified rental.
     */
    public function updateStatus(Request $request, string $id)
    {
        $rental = Rental::with('rentalItems')->findOrFail($id);

        $request->validate([
            'status' => 'required|in:Menunggu Pembayaran,Aktif / Disewa,Selesai,Dibatalkan',
        ]);

        $oldStatus = $rental->status;
        $newStatus = $request->status;

        $fine = $rental->fine;
        $returnDate = $rental->return_date;

        DB::beginTransaction();

        try {
            // KONDISI A: JIKA STATUS DIUBAH JADI 'Selesai' (Barang Dikembalikan)
            if ($newStatus === 'Selesai' && $oldStatus !== 'Selesai') {
                $returnDate = Carbon::now(); // Ambil tanggal pengembalian riil saat ini
                $dueDate = Carbon::parse($rental->end_date); // Deadline sewa seharusnya

                // Kalkulasi Denda jika telat mengembalikan bray
                if ($returnDate->gt($dueDate)) {
                    $hoursLate = $returnDate->diffInHours($dueDate);
                    $fineRatePerHour = 15000; // Aturan bisnis Rp 15.000 / jam
                    $fine = $hoursLate * $fineRatePerHour;
                }

                // 🔥 KEMBALIKAN STOK BARANG SECARA OTOMATIS
                foreach ($rental->rentalItems as $item) {
                    if (!empty($item->camera_id)) {
                        // Jika item itu kamera, tambahkan stoknya kembali ke tabel cameras
                        Camera::where('id', $item->camera_id)->increment('stock', $item->quantity);
                    } elseif (!empty($item->equipment_id)) {
                        // Jika item itu lensa/aksesoris, tambahkan stoknya kembali ke tabel equipments
                        Equipment::where('id', $item->equipment_id)->increment('stock', $item->quantity);
                    }
                }
            }

            // KONDISI B: JIKA TRANSAKSI 'Dibatalkan' (Stok dikembalikan karena batal sewa)
            if ($newStatus === 'Dibatalkan' && $oldStatus !== 'Dibatalkan' && $oldStatus !== 'Selesai') {
                
                // 🔥 KEMBALIKAN STOK KARENA PEMBATALAN TRANSAKSI
                foreach ($rental->rentalItems as $item) {
                    if (!empty($item->camera_id)) {
                        Camera::where('id', $item->camera_id)->increment('stock', $item->quantity);
                    } elseif (!empty($item->equipment_id)) {
                        Equipment::where('id', $item->equipment_id)->increment('stock', $item->quantity);
                    }
                }
            }

            // 4. Update status final ke database
            $rental->update([
                'status' => $newStatus,
                'return_date' => $returnDate,
                'fine' => $fine
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Status rental dan kalkulasi denda berhasil diperbarui!',
                'data' => $rental->load('rentalItems.camera', 'rentalItems.equipment'),
                'info_keterlambatan'=> [
                    'total_denda_keterlambatan' => $fine
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status rental: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified rental.
     */
    public function destroy(string $id)
    {
        $rental = Rental::findOrFail($id);

        $rental->delete();

        return response()->json([
            'message' => 'Rental deleted successfully'
        ]);
    }
}   