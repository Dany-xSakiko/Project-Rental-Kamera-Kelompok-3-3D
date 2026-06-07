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
    $type = $request->type;
    $searchTerm = $request->search;

    $fetchCameras = false;
    $fetchEquipments = false;

    // Tentukan target pencarian 
    if (empty($type) || strtolower($type) === 'semua') {
        $fetchCameras = true;
        $fetchEquipments = true;
    } elseif (in_array(strtolower($type), ['mirrorless', 'dslr'])) {
        $fetchCameras = true;
    } elseif (in_array(strtolower($type), ['lensa', 'aksesoris'])) {
        $fetchEquipments = true;
    }

    $cameras = collect();
    $equipments = collect();

    // -------------------------------------------------------------------------
    // KONDISI 1: AMBIL DATA DARI TABEL KAMERAS
    // -------------------------------------------------------------------------
    if ($fetchCameras) {
        $cameraQuery = Camera::query();

        if ($request->filled('search')) {
            $cameraQuery->where(function($q) use ($searchTerm) {
                $q->where('brand', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('type', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if ($request->filled('brand')) {
            $cameraQuery->where('brand', $request->brand);
        }

        if (!empty($type) && strtolower($type) !== 'semua' && in_array(strtolower($type), ['mirrorless', 'dslr'])) {
            $cameraQuery->whereRaw('LOWER(type) = ?', [strtolower($type)]);
        }

        if ($request->filled('available')) {
            if ($request->available == 'true' || $request->available == '1') {
                $cameraQuery->where('stock', '>', 0);
            } else {
                $cameraQuery->where('stock', '=', 0);
            }
        }

        if ($request->filled('min_price')) {
            $cameraQuery->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $cameraQuery->where('price_per_day', '<=', $request->max_price);
        }

        $cameras = $cameraQuery->latest()->get();

        foreach ($cameras as $cam) {
            $cam->name = $cam->brand . ' ' . $cam->type;
        }
    }

    // KONDISI 2: AMBIL DATA DARI TABEL EQUIPMENTS (LENSA & AKSESORIS)
    if ($fetchEquipments) {
        // Tambahkan query ke model Equipment
        $equipmentQuery = \App\Models\Equipment::with('category');

        if ($request->filled('search')) {
            $equipmentQuery->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('brand', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        if ($request->filled('brand')) {
            $equipmentQuery->where('brand', $request->brand);
        }

        // Filter berdasarkan nama kategori di tabel sebelah
        if (!empty($type) && strtolower($type) !== 'semua' && in_array(strtolower($type), ['lensa', 'aksesoris'])) {
            $equipmentQuery->whereHas('category', function($q) use ($type) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($type)]);
            });
        }

        if ($request->filled('available')) {
            if ($request->available == 'true' || $request->available == '1') {
                $equipmentQuery->where('stock', '>', 0);
            } else {
                $equipmentQuery->where('stock', '=', 0);
            }
        }

        if ($request->filled('min_price')) {
            $equipmentQuery->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $equipmentQuery->where('price_per_day', '<=', $request->max_price);
        }

        $equipments = $equipmentQuery->latest()->get();

        foreach ($equipments as $eq) {
            $eq->type = $eq->category ? $eq->category->name : 'Aksesoris';
        }
    }


    // 3. GABUNGKAN SEMUA HASIL
    $combinedData = $cameras->concat($equipments);

    return response()->json([
        'success' => true,
        'message' => 'Berhasil memfilter seluruh katalog secara real-time!',
        'total_found' => $combinedData->count(),
        'data' => $combinedData
    ], 200);
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