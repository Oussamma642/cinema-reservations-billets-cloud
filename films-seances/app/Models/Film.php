<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'release_date',
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