<?php

use App\Http\Controllers\CodeExplainerController;
use Illuminate\Support\Facades\Route;

Route::post('/explain', [CodeExplainerController::class, 'explain']);
Route::get('/history', [CodeExplainerController::class, 'history']);
