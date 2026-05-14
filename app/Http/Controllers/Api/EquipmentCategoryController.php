<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipmentCategory;
use Illuminate\Http\Request;

class EquipmentCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            EquipmentCategory::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:50'
        ]);

        $category = EquipmentCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            EquipmentCategory::findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $category = EquipmentCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|max:50'
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function destroy(string $id)
    {
        $category = EquipmentCategory::findOrFail($id);

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}