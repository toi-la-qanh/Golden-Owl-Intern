// src/components/WeatherDashboard.js

import React, { useState } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
    const [cityName, setCityName] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const fetchWeatherData = async (city) => {
        try {
            const response = await axios.get(`http://localhost:8000/${city}`);
            setWeatherData(response.data);
            setError('');
        } catch (err) {
            setError('Could not fetch weather data. Please try again.');
        }
    };

    const handleSearch = () => {
        if (cityName) {
            fetchWeatherData(cityName);
        } else {
            setError('Please enter a city name.');
        }
    };

    const handleLocation = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(`currentLocation?lat=${latitude}&long=${longitude}`);
        });
    };

    const handleSubscribe = () => {
        // Add subscription logic here
        console.log(`Subscribed: ${email}`);
    };

    return (
        <div className="flex">
            <div className="">
                <h1>Weather Dashboard</h1>
            </div>
            <div className="">
                <div className="">
                    <h3>Enter a City Name</h3>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="E.g., New York, London, Tokyo"
                    />
                    <br />
                    <p id="error-anounce">{error}</p>
                    <button type="button" onClick={handleSearch}>Search</button>
                    <br />
                    <div className="">or</div>
                    <button type="button" onClick={handleLocation}>Use Current Location</button>
                    <div className="">
                        <h3>Subscribe for Daily Weather Forecast</h3>
                        <p className="">Get daily weather updates and forecasts for your desired city. Subscribe with your email address to receive daily weather updates.</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                        />
                        <br />
                        <div className="">
                            <button type="button" onClick={() => console.log('Unsubscribed')}>Unsubscribe</button>
                            <button type="button" onClick={handleSubscribe}>Subscribe</button>
                        </div>
                    </div>
                </div>
                {weatherData && (
                    <div className="">
                        <div className="">
                            <div className="">
                                <h1>
                                    <span className="" id="locate">{weatherData.location.name}</span> (
                                    <span className="">{new Date().toLocaleDateString()}</span>)
                                </h1>
                                <ul>
                                    <li>Temperature: <span className="">{weatherData.current.temp_c}</span>&deg;C</li>
                                    <li>Wind: <span className="">{weatherData.current.wind_mph}</span> M/S</li>
                                    <li>Humidity: <span className="">{weatherData.current.humidity}</span>%</li>
                                </ul>
                            </div>
                            <div className="">
                                <img className="" src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
                                <p id="">{weatherData.current.condition.text}</p>
                            </div>
                        </div>
                        <div className="">
                            <h2>4-Day Forecast</h2>
                            <div className="">
                                {weatherData.forecast.forecastday.map((day, index) => (
                                    <div className="" key={index}>
                                        <h4>({new Date(day.date).toLocaleDateString()})</h4>
                                        <img className="" src={day.day.condition.icon} alt={day.day.condition.text} />
                                        <ul>
                                            <li>Temp: <span className="">{day.day.avgtemp_c}</span>&deg;C</li>
                                            <li>Wind: <span className="">{day.day.maxwind_mph}</span> M/S</li>
                                            <li>Humidity: <span className="">{day.day.avghumidity}</span>%</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;
