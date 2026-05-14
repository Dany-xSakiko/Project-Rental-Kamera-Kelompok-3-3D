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
    public function index()
    {
        return response()->json(
            Camera::latest()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $camera = Camera::findOrFail($id);

        $camera->delete();

        return response()->json([
            'message' => 'Camera deleted successfully'
        ]);
    }
}