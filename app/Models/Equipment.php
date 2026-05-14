<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    protected $table = 'equipments';

    protected $fillable = [
        'equipment_category_id',
        'name',
        'brand',
        'specification',
        'stock',
        'price_per_day',
        'image'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            EquipmentCategory::class,
            'equipment_category_id'
        );
    }

    public function rentalItems(): HasMany
    {
        return $this->hasMany(RentalItem::class);
    }
}