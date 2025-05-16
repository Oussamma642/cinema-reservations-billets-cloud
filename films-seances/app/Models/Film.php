<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Film extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'release_date',
        'poster_url',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'film_categories');
    }

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}