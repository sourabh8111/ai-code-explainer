<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Explanation extends Model
{
    protected $fillable = [
        'language',
        'code',
        'explanation',
        'key_logic',
        'time_complexity',
        'space_complexity',
        'complexity_note',
    ];

    protected $casts = [
        'key_logic' => 'array',
    ];
}
