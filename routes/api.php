<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CameraController;
use App\Http\Controllers\Api\EquipmentCategoryController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\RentalItemController;


Route::apiResource('cameras', CameraController::class);

Route::apiResource(
    'equipment-categories',
    EquipmentCategoryController::class
);

Route::apiResource(
    'equipments',
    EquipmentController::class
);

Route::apiResource(
    'rentals',
    RentalController::class
);

Route::apiResource(
    'rental-items',
    RentalItemController::class
);