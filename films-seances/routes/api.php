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

Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('films', FilmController::class);
    Route::apiResource('salles', SalleController::class);
    Route::apiResource('categories', CategoryController::class);


    // -- Seances
    Route::apiResource('seances', SeanceController::class);
    // Api to get the availability of a seance
    Route::get('seances/{seance}/availability', [SeanceController::class, 'availability']);

});