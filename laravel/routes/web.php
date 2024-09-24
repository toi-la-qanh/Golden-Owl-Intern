<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', [WeatherController::class, 'getWeather']);
Route::get('/{dynamic}', [WeatherController::class, 'getDynamicWeather']);
Route::post('/subscribe', [WeatherController::class, 'sendEmail']);
Route::post('/unsubscribe', [WeatherController::class, 'unSendEmail']);