<?php
namespace Database\Seeders;

use App\Models\Film;
use App\Models\Category;
use App\Models\Salle;
use App\Models\Seance;  

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // // Create categories
        // $categories = Category::factory(10)->create();

        // // Create films and associate them with 1-3 random categories
        // Film::factory(20)->create()->each(function ($film) use ($categories) {
        //     $film->categories()->attach($categories->random(rand(1, 3))->pluck('id')->toArray());
        // });

        // // Create salles
        // Salle::factory(5)->create();

        Seance::factory(10)->create();

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    
    }
}