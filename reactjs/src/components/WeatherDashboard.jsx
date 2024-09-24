import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherDashboard = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const baseURL = "https://golden-owl-intern-laravel.vercel.app";

  const fetchWeatherData = async (city = "Ho Chi Minh City") => {
    try {
      const response = await axios.get(`${baseURL}/${city}`);
      setWeatherData(response.data);
      setLoading(false);
      console.log(response);
      setError("");
    } catch (err) {
      setError("Could not fetch weather data. Maybe wrong city or country.");
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = () => {
    if (cityName) {
      fetchWeatherData(cityName);
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchWeatherData(`currentLocation?lat=${latitude}&long=${longitude}`);
    });
  };

  const handleSubscribe = async () => {
    // Retrieve CSRF cookie
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
      headers: {
        Accept: "application/json",
      },
      // withCredentials: true,
    });

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      try {
        const response = await axios.post(
          `${baseURL}/subscribe`,
          {
            email: email,
            lat: latitude,
            long: longitude,
          },
          {
            headers: {
              Accept: "application/json",
            },
            // withCredentials: true,
            withXSRFToken: true,
          }
        );
        console.log(response);
        alert("Subscribe email successfully !");
        setError("");
      } catch (err) {
        setError(err.email);
        // setLoading(false);
        console.log(err);
      }
    });
  };
  const handleUnSubscribe = async () => {
    // Retrieve CSRF cookie
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
      headers: {
        Accept: "application/json",
      },
      // withCredentials: true,
    });

    try {
      // Proceed to unsubscribe
      const response = await axios.post(
        `${baseURL}/unsubscribe`,
        {
          email: email,
        },
        {
          headers: {
            Accept: "application/json",
          },
          // withCredentials: true,
          withXSRFToken: true,
        }
      );
      console.log(response);
      alert("Unsubscribe email successfully !");
      setError("");
    } catch (err) {
      setError(err.email);
      // setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="bg-blue-200 h-auto w-full">
      <div className="bg-blue-400 text-center font-mono text-3xl p-5 text-gray-200">
        <h1>Weather Dashboard</h1>
      </div>
      <div className="mt-10 flex w-full h-auto px-6 gap-10 flex-col md:flex-row">
        <div className="lg:w-1/4 md:w-1/3 w-full leading-10">
          <h3>Enter a City Name</h3>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="E.g., New York, London, Tokyo"
            className="w-full pl-2"
          />
          <br />
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={handleSearch}
            className="text-white bg-blue-400 w-full mt-5 hover:bg-blue-600"
          >
            Search
          </button>
          <br />
          <div class="flex items-center my-4">
            <div class="flex-1 border-b border-gray-700 mr-2">{}</div>
            <span class="px-2">or</span>
            <div class="flex-1 border-b border-gray-700 ml-2">{}</div>
          </div>
          <button
            type="button"
            onClick={handleLocation}
            className="text-white bg-gray-400 w-full hover:bg-gray-500"
          >
            Use Current Location
          </button>
          <div className="font-mono mt-10">
            <p className="font-bold">
              Subscribe with your email address to receive daily weather
              updates.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-2"
            />
            <p className="text-red-600">{error}</p>
            <br />
            <div className="">
              <button
                className="text-white bg-blue-600 w-full hover:bg-blue-700"
                type="button"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
              <div class="flex items-center my-4">
                <div class="flex-1 border-b border-gray-700 mr-2">{}</div>
                <span class="px-2">or</span>
                <div class="flex-1 border-b border-gray-700 ml-2">{}</div>
              </div>
              <button
                className="text-white bg-blue-400 w-full hover:bg-blue-500"
                type="button"
                onClick={handleUnSubscribe}
              >
                Unsubscribe
              </button>
              <div className="text-sm mt-2 font-italic">
                If you've already subscribe your weather forecast
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          weatherData && (
            <div className="w-full lg:w-3/4 md:w-2/3">
              <div className="flex items-center justify-between bg-blue-400 text-white p-5">
                <div className="">
                  <h1 className="text-xl font-bold">
                    <span className="">{weatherData.location.name}</span> (
                    <span className="">{new Date().toLocaleDateString()}</span>)
                  </h1>
                  <ul>
                    <li>
                      Temperature:{" "}
                      <span className="">{weatherData.current.temp_c}</span>
                      &deg;C
                    </li>
                    <li>
                      Wind:{" "}
                      <span className="">{weatherData.current.wind_mph}</span>{" "}
                      M/S
                    </li>
                    <li>
                      Humidity:{" "}
                      <span className="">{weatherData.current.humidity}</span>%
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center flex-col items-center">
                  <img
                    className="w-20 h-20"
                    src={weatherData.current.condition.icon}
                    alt={weatherData.current.condition.text}
                  />
                  <p id="">{weatherData.current.condition.text}</p>
                </div>
              </div>
              <div className="mt-10 leading-10">
                <h2 className="font-bold">4-Day Forecast</h2>
                <div className="flex flex-row justify-between">
                  {weatherData.forecast.forecastday
                    .slice(1, 5)
                    .map((day, index) => (
                      <div className="bg-gray-400 p-5 text-white" key={index}>
                        <h4>({new Date(day.date).toLocaleDateString()})</h4>
                        <img
                          className=""
                          src={day.day.condition.icon}
                          alt={day.day.condition.text}
                        />
                        <ul>
                          <li>
                            Temp: <span className="">{day.day.avgtemp_c}</span>
                            &deg;C
                          </li>
                          <li>
                            Wind:{" "}
                            <span className="">{day.day.maxwind_mph}</span> M/S
                          </li>
                          <li>
                            Humidity:{" "}
                            <span className="">{day.day.avghumidity}</span>%
                          </li>
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
