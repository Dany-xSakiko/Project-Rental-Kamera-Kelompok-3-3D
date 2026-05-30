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
        // Inisialisasi Query Builder dari Model Camera
        $query = Camera::query();

        if ($request->filled('Search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('brand', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        //pencarian  spesifik merk tertentu
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // FILTER TYPE / KATEGORI: Pencarian jenis kamera (misal: DSLR, Mirrorless)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        //FILTER KETERSEDIAAN STOK: Mengecek apakah barang ready atau habis
        if ($request->filled('available')) {
            if ($request->available == 'true' || $request->available == '1') {
                $query->where('stock', '>', 0); // Hanya tampilkan yang ready stok
            } elseif ($request->available == 'false' || $request->available == '0') {
                $query->where('stock', '=', 0); // Hanya tampilkan yang kosong/habis
            }
        }

        // FILTER RENTANG HARGA MINIMAL (Min Price)
        if ($request->filled('min_price')) {
            $query->where('price_per_day', '>=', $request->min_price);
        }

        // FILTER RENTANG HARGA MAKSIMAL (Max Price)
        if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        //Urutkan dari yang paling baru diinput
        $cameras = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil memfilter katalog kamera secara real-time!',
            'total_found' => $cameras->count(),
            'data' => $cameras
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