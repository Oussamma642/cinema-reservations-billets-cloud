<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = Salle::all();
        return response()->json($sales);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
        ]);

        $salle = Salle::create($validated);
        return response()->json($salle, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $salle = Salle::findOrFail($id);
        return response()->json($salle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $salle = Salle::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:50',
            'capacity' => 'sometimes|required|integer|min:1',
        ]);

        $salle->update($validated);
        return response()->json($salle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();
        return response()->json(null, 204);
    }
}