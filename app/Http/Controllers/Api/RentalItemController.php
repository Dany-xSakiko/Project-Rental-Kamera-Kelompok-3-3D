<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Rental;
use App\Models\RentalItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RentalItemController extends Controller
{
    /**
     * Display all rental items.
     */
    public function index()
    {
        $items = RentalItem::with([
            'rental',
            'equipment'
        ])->latest()->get();

        return response()->json($items);
    }

    /**
     * Store a newly created rental item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rental_id' => 'required|exists:rentals,id',
            'equipment_id' => 'required|exists:equipments,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $equipment = Equipment::findOrFail(
            $validated['equipment_id']
        );

        if ($equipment->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Equipment stock is not enough'
            ], 400);
        }

        $totalPrice = $equipment->price_per_day * $validated['quantity'];

        $item = RentalItem::create([
        'rental_id' => $validated['rental_id'],
        'equipment_id' => $validated['equipment_id'],
        'price_per_day' => $equipment->price_per_day,
        'quantity' => $validated['quantity'],
        'total_price' => $totalPrice
        ]);

        $rental = Rental::findOrFail($validated['rental_id']);
        $rental->increment('total_price', $totalPrice);

        $equipment->decrement('stock', $validated['quantity']);

        return response()->json([
            'message' => 'Rental item created successfully',
            'data' => $item
        ], 201);
    }

    /**
     * Display the specified rental item.
     */
    public function show(string $id)
    {
        $item = RentalItem::with([
            'rental',
            'equipment'
        ])->findOrFail($id);

        return response()->json($item);
    }

    /**
     * Update the specified rental item.
     */
    public function update(Request $request, string $id)
    {
        $item = RentalItem::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $equipment = Equipment::findOrFail(
            $item->equipment_id
        );

        $quantityDifference = $validated['quantity'] - $item->quantity;

        // Cek stok jika quantity ditambah
        if ($quantityDifference > 0 && $equipment->stock < $quantityDifference) {
            return response()->json([
                'message' => 'Equipment stock is not enough for the additional quantity'
            ], 400);
        }

        $newTotalPrice = (
            $equipment->price_per_day *
            $validated['quantity']
        );

        $difference = $newTotalPrice - $item->total_price;

        DB::transaction(function () use ($item, $validated, $newTotalPrice, $difference, $equipment, $quantityDifference) {
            $item->update([
                'quantity' => $validated['quantity'],
                'total_price' => $newTotalPrice
            ]);

            if ($difference !== 0) {
                $item->rental->increment('total_price', $difference);
            }

            // Update stok jika quantity berubah
            if ($quantityDifference !== 0) {
                $equipment->decrement('stock', $quantityDifference);
            }
        });

        return response()->json([
            'message' => 'Rental item updated successfully',
            'data' => $item
        ]);
    }

    /**
     * Remove the specified rental item.
     */
    public function destroy(Request $request, string $id)
    {
        $item = RentalItem::findOrFail($id);

        if ($request->user()->role !== 'admin' && $item->rental->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        DB::transaction(function () use ($item) {
            // Kembalikan stok equipment
            if ($item->equipment_id) {
                Equipment::where('id', $item->equipment_id)->increment('stock', $item->quantity);
            }

            // Kurangi total price rental
            $item->rental->decrement('total_price', $item->total_price);

            // Hapus item
            $item->delete();
        });

        return response()->json([
            'message' => 'Rental item deleted successfully'
        ]);
    }
}