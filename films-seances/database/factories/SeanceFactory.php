<?php

namespace Database\Factories;

use App\Models\Film;
use App\Models\Salle;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeanceFactory extends Factory
{
    protected $model = \App\Models\Seance::class;

    public function definition()
    {
        // pick a random existing film and salle
        $filmId  = Film::inRandomOrder()->first()->id;
        $salle   = Salle::inRandomOrder()->first();

        // you could also ensure reserved_places <= salle.capacity,
        // but we’ll default to 0 here
        return [
            'film_id'        => $filmId,
            'salle_id'       => $salle->id,
            'scheduled_at'   => $this->faker->dateTimeBetween('now', '+1 month'),
            'price'          => $this->faker->randomFloat(2, 20, 100),
            'reserved_places'=> 0,
            'status'         => $this->faker->randomElement(['active','cancelled','full']),
        ];
    }
}