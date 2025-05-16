<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\FilmController;
use App\Http\Middleware\VerifyJwtToken;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\CategoryController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes that don't require authentication
Route::get('films', [FilmController::class, 'index']);
Route::get('films/{id}', [FilmController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);

// Public routes for seances
Route::get('seances', [SeanceController::class, 'index']);
Route::get('seances/{id}', [SeanceController::class, 'show']);
Route::get('seances/{seance}/availability', [SeanceController::class, 'availability']);

// Public routes for salles
Route::get('salles', [SalleController::class, 'index']);
Route::get('salles/{id}', [SalleController::class, 'show']);

// Protected routes that require JWT authentication
Route::middleware('jwt.auth')->group(function () {
    // Full CRUD for films except the public GET routes
    Route::post('films', [FilmController::class, 'store']);
    Route::put('films/{id}', [FilmController::class, 'update']);
    Route::delete('films/{id}', [FilmController::class, 'destroy']);
    
    // Protected CRUD for seances (except the public GET routes)
    Route::post('seances', [SeanceController::class, 'store']);
    Route::put('seances/{id}', [SeanceController::class, 'update']);
    Route::delete('seances/{id}', [SeanceController::class, 'destroy']);
    
    // Protected CRUD for salles (except the public GET routes)
    Route::post('salles', [SalleController::class, 'store']);
    Route::put('salles/{id}', [SalleController::class, 'update']);
    Route::delete('salles/{id}', [SalleController::class, 'destroy']);
});