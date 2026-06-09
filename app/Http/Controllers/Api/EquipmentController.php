<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $searchTerm = $request->search;
        $equipmentQuery = Equipment::with('category');

        if ($request->filled('search')) {
            $equipmentQuery->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('brand', 'LIKE', "%{$searchTerm}%");
            });
        }

        if ($request->filled('brand')) {
            $equipmentQuery->where('brand', $request->brand);
        }

        if ($request->filled('type')) {
            $equipmentQuery->whereHas('category', function ($q) use ($request) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($request->type)]);
            });
        }

        if ($request->filled('available')) {
            $equipmentQuery->where('stock', $request->available === 'true' ? '>' : '=', 0);
        }

        if ($request->filled('min_price')) {
            $equipmentQuery->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $equipmentQuery->where('price_per_day', '<=', $request->max_price);
        }

        $equipments = $equipmentQuery->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $equipments,
        ], 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden'], 403);
        }

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
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

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

    public function destroy(Request $request, string $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $equipment = Equipment::findOrFail($id);

        $equipment->delete();

        return response()->json([
            'message' => 'Equipment deleted successfully'
        ]);
    }
}