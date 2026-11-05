<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['app' => 'AI Code Explainer API', 'status' => 'ok']);
});
