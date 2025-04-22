<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Salle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
    ];

    public function seances()
    {
        return $this->hasOne(Seance::class);
    }
}