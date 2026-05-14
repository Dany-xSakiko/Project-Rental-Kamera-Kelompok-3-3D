<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Equipment::with('category')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_category_id' => 'required|exists:equipment_categories,id',
            'name' => 'required|max:100',
            'brand' => 'nullable|max:50',
            'specification' => 'nullable',
            'stock' => 'required|integer|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'image' => 'nullable'
        ]);

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => 'Equipment created successfully',
            'data' => $equipment
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            Equipment::with('category')->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $equipment = Equipment::findOrFail($id);

        $validated = $request->validate([
            'equipment_category_id' => 'required|exists:equipment_categories,id',
            'name' => 'required|max:100',
            'brand' => 'nullable|max:50',
            'specification' => 'nullable',
            'stock' => 'required|integer|min:0',
            'price_per_day' => 'required|numeric|min:0',
            'image' => 'nullable'
        ]);

        $equipment->update($validated);

        return response()->json([
            'message' => 'Equipment updated successfully',
            'data' => $equipment
        ]);
    }

    public function destroy(string $id)
    {
        $equipment = Equipment::findOrFail($id);

        $equipment->delete();

        return response()->json([
            'message' => 'Equipment deleted successfully'
        ]);
    }
}