<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Rental;
use App\Models\RentalItem;
use Illuminate\Http\Request;

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

        $subtotal = (
            $equipment->price_per_day *
            $validated['quantity']
        );

        $item = RentalItem::create([
            'rental_id' => $validated['rental_id'],
            'equipment_id' => $validated['equipment_id'],
            'quantity' => $validated['quantity'],
            'subtotal' => $subtotal
        ]);

        $rental = Rental::findOrFail(
            $validated['rental_id']
        );

        $rental->increment('total_price', $subtotal);

        $equipment->decrement(
            'stock',
            $validated['quantity']
        );

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

        $newSubtotal = (
            $equipment->price_per_day *
            $validated['quantity']
        );

        $item->update([
            'quantity' => $validated['quantity'],
            'subtotal' => $newSubtotal
        ]);

        return response()->json([
            'message' => 'Rental item updated successfully',
            'data' => $item
        ]);
    }

    /**
     * Remove the specified rental item.
     */
    public function destroy(string $id)
    {
        $item = RentalItem::findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Rental item deleted successfully'
        ]);
    }
}