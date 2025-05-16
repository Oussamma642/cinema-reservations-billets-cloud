<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Film;

class FilmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $films = Film::with('categories')->get();
        
        // Transform the data to match frontend expectations
        $transformedFilms = $films->map(function ($film) {
            return [
                'id' => $film->id,
                'title' => $film->title,
                'description' => $film->description,
                'duration' => $film->duration,
                'release_date' => $film->release_date,
                'poster_url' => $film->poster_url ?? 'https://via.placeholder.com/300x450?text=No+Poster', 
                'status' => 'active', // Default to active
                'genre' => $film->categories->isNotEmpty() ? $film->categories->first()->name : 'Unknown',
                'categories' => $film->categories->pluck('name')
            ];
        });
        
        return response()->json($transformedFilms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'release_date' => 'nullable|date',
            'poster_url' => 'nullable|string',
        ]);
        
        $film = Film::create($validated);
        
        if ($request->has('categories')) {
            $film->categories()->attach($request->categories);
        }
        
        return response()->json($film, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $film = Film::with('categories')->findOrFail($id);
        
        $transformedFilm = [
            'id' => $film->id,
            'title' => $film->title,
            'description' => $film->description,
            'duration' => $film->duration,
            'release_date' => $film->release_date,
            'poster_url' => $film->poster_url ?? 'https://via.placeholder.com/300x450?text=No+Poster',
            'status' => 'active', // Default to active
            'genre' => $film->categories->isNotEmpty() ? $film->categories->first()->name : 'Unknown',
            'categories' => $film->categories->pluck('name')
        ];
        
        return response()->json($transformedFilm);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $film = Film::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'sometimes|required|integer|min:1',
            'release_date' => 'nullable|date',
            'poster_url' => 'nullable|string',
        ]);
        
        $film->update($validated);
        
        if ($request->has('categories')) {
            $film->categories()->sync($request->categories);
        }
        
        return response()->json($film);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $film = Film::findOrFail($id);
        $film->categories()->detach();
        $film->delete();
        
        return response()->noContent();
    }
}