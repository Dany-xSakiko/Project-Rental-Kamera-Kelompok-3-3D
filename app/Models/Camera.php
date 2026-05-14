<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Camera extends Model
{
    protected $fillable = [
        'brand',
        'serial_number',
        'type',
        'description',
        'stock',
        'price_per_day',
        'image'
    ];

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }
}