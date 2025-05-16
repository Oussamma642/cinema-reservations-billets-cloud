<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Film;
use App\Models\Seance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $seances = Seance::all();
        return response()->json($seances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'film_id'      => 'required|exists:films,id',
            'salle_id'     => 'required|exists:salles,id',
            'scheduled_at' => 'required|date',
            'price'        => 'required|numeric|min:0|max:999999.99',
            'status'       => 'sometimes|in:active,cancelled,full',
        ]);

        // Vérifier si la salle est disponible à cette date
        $existingSeance = Seance::where('salle_id', $validated['salle_id'])
            ->where('scheduled_at', $validated['scheduled_at'])
            ->first();

        if ($existingSeance) {
            return response()->json([
                'message' => 'La salle est déjà réservée pour cette date et heure',
            ], 422);
        }

        // Vérifier si le film existe
        $film = Film::findOrFail($validated['film_id']);

        // Calculer l'heure de fin de la séance
        $endTime = Carbon::parse($validated['scheduled_at'])->addMinutes($film->duration);

        // Vérifier les chevauchements avec d'autres séances
        $overlappingSeance = Seance::where('salle_id', $validated['salle_id'])
            ->where(function ($query) use ($validated, $endTime) {
                $query->whereBetween('scheduled_at', [$validated['scheduled_at'], $endTime])
                    ->orWhereBetween(DB::raw('DATE_ADD(scheduled_at, INTERVAL (SELECT duration FROM films WHERE id = film_id) MINUTE)'),
                        [$validated['scheduled_at'], $endTime]);
            })
            ->first();

        if ($overlappingSeance) {
            return response()->json([
                'message' => 'Il y a un chevauchement avec une autre séance dans cette salle',
            ], 422);
        }

        $seance = Seance::create($validated);
        return response()->json($seance, 201);
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
            if ($seance->reserved_places == $salle->capacity) {
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
        $seance = Seance::findOrFail($id);
        $seance->delete();
        return response()->json(null, 204);
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