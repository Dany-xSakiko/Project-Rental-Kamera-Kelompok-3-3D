<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use App\Models\Rental;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    /**
     * Display a listing of rentals.
     */
    public function index()
    {
        $rentals = Rental::with([
            'user',
            'camera',
            'rentalItems.equipment'
        ])->latest()->get();

        return response()->json($rentals);
    }

    /*Store a newly created rental from checkout.*/
    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'total_days' => 'required|integer|min:1',
            'total_price' => 'required|integer|min:0',
            'items' => 'required|array|min:1',
        ]);

        // Buat booking code unik
        $bookingCode = 'YK-' . strtoupper(\Illuminate\Support\Str::random(8));

        // Simpan ke tabel rentals
        $rental = Rental::create([
            'booking_code' => $bookingCode,
            'user_id' => $request->user()->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_days' => $request->total_days,
            'total_price' => $request->total_price,
            'status' => 'Aktif / Disewa',
        ]);

        // Simpan items ke tabel rental_items
        foreach ($request->items as $item) {
            \App\Models\RentalItem::create([
                'rental_id' => $rental->id,
                'camera_id' => $item['camera_id'] ?? null,
                'equipment_id' => $item['equipment_id'] ?? null,
                'price_per_day' => $item['price_per_day'],
            ]);
        }

        return response()->json([
            'message' => 'Booking berhasil!',
            'booking_code' => $bookingCode,
            'rental' => $rental,
        ], 201);
    }

    /**
     * Display the specified rental.
     */
    public function show(string $id)
    {
        $rental = Rental::with([
            'user',
            'camera',
            'rentalItems.equipment'
        ])->findOrFail($id);

        return response()->json($rental);
    }

    /**
     * Update the specified rental.
     */
    public function update(Request $request, string $id)
    {
        $rental = Rental::findOrFail($id);

        $validated = $request->validate([
            'rent_date' => 'required|date',
            'return_due' => 'required|date',
            'return_date' => 'nullable|date',
            'status' => 'required|in:pending,borrowed,returned',
            'fine' => 'nullable|numeric|min:0'
        ]);

        $rental->update($validated);

        return response()->json([
            'message' => 'Rental updated successfully',
            'data' => $rental
        ]);
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