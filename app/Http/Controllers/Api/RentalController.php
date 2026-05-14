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

    /**
     * Store a newly created rental.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'camera_id' => 'required|exists:cameras,id',
            'rent_date' => 'required|date',
            'return_due' => 'required|date',
            'status' => 'nullable|in:pending,borrowed,returned'
        ]);

        $camera = Camera::findOrFail($validated['camera_id']);

        if ($camera->stock <= 0) {
            return response()->json([
                'message' => 'Camera stock is empty'
            ], 400);
        }

        $days = now()->parse($validated['rent_date'])
            ->diffInDays(
                now()->parse($validated['return_due'])
            );

        $days = max($days, 1);

        $totalPrice = $camera->price_per_day * $days;

        $rental = Rental::create([
            'user_id' => $validated['user_id'],
            'camera_id' => $validated['camera_id'],
            'rent_date' => $validated['rent_date'],
            'return_due' => $validated['return_due'],
            'status' => $validated['status'] ?? 'pending',
            'total_price' => $totalPrice,
            'fine' => 0
        ]);

        $camera->decrement('stock');

        return response()->json([
            'message' => 'Rental created successfully',
            'data' => $rental
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