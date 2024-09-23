<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    protected $weatherHistory = null;// Variable to store weather history temporarily
    protected $nameOfCity = null;

    public function getWeather(): JsonResponse
    {
        $response = Http::get('http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=Ho Chi Minh City&days=5&aqi=no&alerts=no');

        $data = json_decode($response->getBody()->getContents(), true);
        
        $this->weatherHistory = $data;
        $this->nameOfCity = $data['location']['name'];

        return response()->json($data);
    }

    public function getDynamicWeather($dynamic, Request $request): JsonResponse
    {
        if ($dynamic == $this->nameOfCity) {
            return response()->json($this->weatherHistory);
        }

        $response = '';

        if ($dynamic == 'currentLocation') {
            $lat = $request->query('lat');
            $long = $request->query('long');
            $response = Http::get("http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q={$lat},{$long}&days=5&aqi=no&alerts=no");
        } else {
            $response = Http::get("http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q={$dynamic}&days=5&aqi=no&alerts=no");
        }

        $data = json_decode($response->getBody()->getContents(), true);

        $this->weatherHistory = $data;
        $this->nameOfCity = $data['location']['name'];

        return response()->json($data);
    }

    // public function sendEmail(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'subject' => 'required|string',
    //         'text' => 'required|string',
    //     ]);

    //     $data = [
    //         'subject' => $request->subject,
    //         'body' => $request->text,
    //     ];

    //     Mail::send([], [], function ($message) use ($request, $data) {
    //         $message->to($request->email)
    //                 ->subject($data['subject'])
    //                 ->setBody($data['body'], 'text/html'); // For HTML rich messages
    //     });

    //     return response()->json(['status' => 'Email sent']);
    // }
}
