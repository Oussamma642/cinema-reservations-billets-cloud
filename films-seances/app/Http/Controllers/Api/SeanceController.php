<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // If film_id is provided, filter seances by film_id
        if ($request->has('film_id')) {
            $seances = Seance::where('film_id', $request->film_id)->get();
        } else {
        $seances = Seance::all();
        }
        
        return response()->json($seances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $seance = Seance::find($id);
        return response()->json($seance);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seance $seance)
    {
        // $request->validate([
        //     'reservedPlaces' => 'sometimes|integer|min:1',
        //     // other validation rules
        // ]);

        if ($request->has('reservedPlaces')) {
            // Add the new places to the existing reserved places
            $seance->reserved_places += $request->reservedPlaces;

            // Optionally check if the seance is now full
            $salle = $seance->salle;
            if ($seance->reserved_places >= $salle->capacity) {
                $seance->status = 'full';
            }
        }

        // Handle other updates if needed
        $seance->save();
        return response()->json($seance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function availability($seanceId)
    {
        // جلب السيانس مع الصالة
        $seance = Seance::with('salle')->find($seanceId);

        if (! $seance) {
            return response()->json([
                'message' => 'Séance non trouvée',
            ], 404);
        }

        // سعة الصالة
        $capacity = $seance->salle->capacity;

        // الأماكن المحجوزة
        $reserved = $seance->reserved_places;

        // الأماكن المتبقية
        $available = $capacity - $reserved;
        if ($available < 0) {
            $available = 0;
        }

        return response()->json([
            'availablePlaces' => $available,
        ]);
    }

}