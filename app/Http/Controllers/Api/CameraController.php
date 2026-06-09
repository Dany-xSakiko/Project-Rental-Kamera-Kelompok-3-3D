<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use Illuminate\Http\Request;

class CameraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchTerm = $request->search;
        $cameraQuery = Camera::query();

    if ($request->filled('search')) {
        $cameraQuery->where(function ($q) use ($searchTerm) {
            $q->where('brand', 'LIKE', "%{$searchTerm}%")
              ->orWhere('type', 'LIKE', "%{$searchTerm}%");
        });
    }

    if ($request->filled('brand')) {
        $cameraQuery->where('brand', $request->brand);
    }

    if ($request->filled('available')) {
        $cameraQuery->where('stock', $request->available === 'true' ? '>' : '=', 0);
    }

    if ($request->filled('min_price')) {
        $cameraQuery->where('price_per_day', '>=', $request->min_price);
    }

    if ($request->filled('max_price')) {
        $cameraQuery->where('price_per_day', '<=', $request->max_price);
    }

    $cameras = $cameraQuery->latest()->get();

    return response()->json([
        'success' => true,
        'data' => $cameras,
    ], 200);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'brand' => 'required|max:50',
            'serial_number' => 'required|unique:cameras',
            'type' => 'nullable|max:50',
            'description' => 'nullable',
            'stock' => 'required|integer|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'image' => 'nullable'
        ]);

        $camera = Camera::create($validated);

        return response()->json([
            'message' => 'Camera created successfully',
            'data' => $camera
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $camera = Camera::findOrFail($id);

        return response()->json($camera);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden'], 403);
        }

        $camera = Camera::findOrFail($id);

        $validated = $request->validate([
            'brand' => 'required|max:50',
            'serial_number' => 'required|unique:cameras,serial_number,' . $id,
            'type' => 'nullable|max:50',
            'description' => 'nullable',
            'stock' => 'required|integer|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'image' => 'nullable'
        ]);

        $camera->update($validated);

        return response()->json([
            'message' => 'Camera updated successfully',
            'data' => $camera
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden'], 403);
        }

        $camera = Camera::findOrFail($id);

        $camera->delete();

        return response()->json([
            'message' => 'Camera deleted successfully'
        ]);
    }
}