<?php

namespace App\Http\Controllers;

use App\Mail\Email;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class WeatherController extends Controller
{
    protected $weatherHistory = null;// Variable to store weather history temporarily
    protected $nameOfCity = null;

    public function getWeather(): JsonResponse
    {
        //Handle api received
        $response = Http::get('http://api.weatherapi.com/v1/forecast.json?key=c6652d40a71f48339d3132525242309&q=Ho Chi Minh City&days=5&aqi=no&alerts=no');

        $data = json_decode($response->getBody()->getContents(), true);

        //Store weather history and the city
        $this->weatherHistory = $data;
        $this->nameOfCity = $data['location']['name'];

        return response()->json($data);
    }

    public function getDynamicWeather($dynamic, Request $request): JsonResponse
    {
        
        //if the city is stored, then display weather history
        if ($dynamic == $this->nameOfCity) {
            return response()->json($this->weatherHistory);
        }

        $response = '';

        if ($dynamic == 'currentLocation') {//display current location weather
            $lat = $request->query('lat');
            $long = $request->query('long');
            $response = Http::get("http://api.weatherapi.com/v1/forecast.json?key=c6652d40a71f48339d3132525242309&q={$lat},{$long}&days=5&aqi=no&alerts=no");
        } else {//display input location weather
            $response = Http::get("http://api.weatherapi.com/v1/forecast.json?key=c6652d40a71f48339d3132525242309&q={$dynamic}&days=5&aqi=no&alerts=no");
        }

        $data = json_decode($response->getBody()->getContents(), true);

        $this->weatherHistory = $data;
        $this->nameOfCity = $data['location']['name'];

        return response()->json($data);
    }
    public function sendEmail(Request $request): JsonResponse
    {
        //validate email
        $request->validate([
            'email' => ['required', 'email:rfc,strict,dns'],
        ], [
            'email.required' => "Email is required !",
            'email.email' => 'Email is not valid !',
        ]);

        $response = '';

        $lat = $request->query('lat');
        $long = $request->query('long');
        $response = Http::get("http://api.weatherapi.com/v1/forecast.json?key=c6652d40a71f48339d3132525242309&q={$lat},{$long}&days=5&aqi=no&alerts=no");

        $data = json_decode($response->getBody()->getContents(), true);

        $forecast = $data['current']['condition']['text'];
        $temp = $data['current']['temp_c'];
        $location = $data['location']['name'];
        $country = $data['location']['country'];

        //Send email
        Mail::raw("Thank you for subscribing to our daily weather forecast!\n\nToday's forecast at {$location} in {$country}: {$forecast} with an average temperature of {$temp}°C.\n\nStay tuned for more updates!", function (Message $message) use ($request) {
            $message->to($request->email)
                ->from('quocanh2003vn427@gmail.com')
                ->subject('Your Daily Weather Forecast');
            ;
        });

        return response()->json(['message' => 'Email sent to ' . $request->email . ' successfully !']);
    }
    public function unSendEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email:rfc,strict,dns'],
        ], [
            'email.required' => "Email is required !",
            'email.email' => 'Email is not valid !',
        ]);

        Mail::raw("You have unsubcribe the daily weather forecast!\n\nThank you for using our service !\n\nLet us know if you want to subscribe again !", function (Message $message) use ($request) {
            $message->to($request->email)
                ->from('quocanh2003vn427@gmail.com')
                ->subject('Unsubscribe Daily Weather Forecast');
            ;
        });

        return response()->json(['message' => 'Unsubscribe email sent to ' . $request->email . ' successfully !']);
    }
}
