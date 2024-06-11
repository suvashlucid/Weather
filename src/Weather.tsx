import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import { FaCloud, FaCloudRain, FaSnowflake, FaSun } from "react-icons/fa";

// const currentDate: Date = new Date();

interface Weather {
  id: number;
  description: string;
}
interface Main {
  temp: number;
}
interface ForecastData {
  weather: Weather[];
  main: Main;
}

const ThemeContext = createContext<{
  darkMode: boolean;
  toggleTheme: () => void;
}>({
  darkMode: false,
  toggleTheme: () => {},
});

const Weather: React.FC = () => {
  const [cityName, setCityName] = useState<string>("");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<ForecastData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // const cityMap: { [key: string]: string } = {
  //   पोखरा: "Pokhara",
  //   काठमाडौं: "Kathmandu",
  //   विराटनगर: "Biratnagar",
  //   बेनीघाट: "Bhaktapur",
  // };

  const weatherDescriptionMap: {
    [key: string]: { icon: JSX.Element; label: string };
  } = {
    "few clouds": { icon: <FaCloud size={50} />, label: "बादल" },
    "scattered clouds": { icon: <FaCloud size={50} />, label: "बादल" },
    "broken clouds": { icon: <FaCloud size={50} />, label: "बादल" },
    "overcast clouds": { icon: <FaCloud size={50} />, label: "बादल" },
    "light rain": { icon: <FaCloudRain size={50} />, label: "बर्सात" },
    "moderate rain": { icon: <FaCloudRain size={50} />, label: "बर्सात" },
    "heavy intensity rain": {
      icon: <FaCloudRain size={50} />,
      label: "बर्सात",
    },
    "light snow": { icon: <FaSnowflake size={50} />, label: "बर्फबारी" },
    "moderate snow": { icon: <FaSnowflake size={50} />, label: "बर्फबारी" },
    "heavy snow": { icon: <FaSnowflake size={50} />, label: "बर्फबारी" },
    "clear sky": { icon: <FaSun size={50} />, label: "स्पष्ट" },
  };

  useEffect(() => {
    if (cityName) {
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => fetchWeather(), 1000);
      setTypingTimeout(timeout);
    }
  }, [cityName]);

  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
      );
      setForecastData(response.data.list);
      setCurrentWeather(response.data.list[0]);
      setError(null);
    } catch (error) {
      setError("शहर फेला परेन");
      setForecastData([]);
      setCurrentWeather(null);
    }
  };

  const handleSearch = () => setCityName(searchCity);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchCity(e.target.value);
  // const convertToBikramSambat = (gregorianDate: Date): string =>
  //   bs.toBik_text(gregorianDate.toISOString().split("T")[0]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div
        className={`p-4 md:p-20 ${darkMode ? "bg-gray-900" : "bg-gray-300"}`}
      >
        <div className="flex justify-between items-center mb-4">
          {/* <div className="flex items-center">
            <FaCalendarAlt size={20} className="mr-2" />
            <span className={`ml-2 ${darkMode ? "text-white" : "text-black"}`}>
              {convertToBikramSambat(currentDate)}
            </span>
          </div> */}
          <h1
            className={`text-2xl md:text-4xl font-bold text-green-500 ${
              darkMode && "text-white"
            }`}
          >
            Weather App
            {currentWeather && (
              <div className="mt-9 object-cover ">
                {
                  weatherDescriptionMap[currentWeather.weather[0].description]
                    .icon
                }
              </div>
            )}
          </h1>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchCity}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className={`p-2 mr-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
            <button
              onClick={handleSearch}
              className={`p-2 bg-green-500 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                darkMode && "bg-white text-black"
              }`}
            >
              Search
            </button>
            <DarkModeToggle />
          </div>
          {error ? (
            <p className={`text-red-500 ${darkMode && "text-white"}`}>
              {error}
            </p>
          ) : (
            <>
              {currentWeather && (
                <div
                  className={`p-8 rounded-xl shadow-xl text-center ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    {weatherDescriptionMap[
                      currentWeather.weather[0].description
                    ].icon && (
                      <div className="mr-4">
                        {
                          weatherDescriptionMap[
                            currentWeather.weather[0].description
                          ].icon
                        }
                      </div>
                    )}
                    <p className="text-4xl">
                      {Math.round(currentWeather.main.temp - 273.15)}°C
                    </p>
                  </div>
                  <div className="text-3xl mt-2">
                    <p className="text-lg">
                      {
                        weatherDescriptionMap[
                          currentWeather.weather[0].description
                        ].label
                      }
                    </p>
                  </div>
                  {/* <p className="text-sm mt-2">
                    {convertToBikramSambat(currentDate)}
                  </p> */}
                </div>
              )}
              {forecastData.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold">Upcoming 5-hour forecast:</p>
                  <div className="flex flex-row flex-wrap justify-center space-x-4">
                    {forecastData
                      .slice(1, 6)
                      .map((forecast: ForecastData, index: number) => (
                        <div
                          key={index}
                          className={`p-4 rounded-md shadow-md text-center ${
                            darkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          <p className="text-2xl mt-4">
                            {Math.round(forecast.main.temp - 273.15)}°C
                          </p>
                          <p className="text-lg mt-2">
                            {
                              weatherDescriptionMap[
                                forecast.weather[0].description
                              ].label
                            }
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 bg-${darkMode ? "white" : "black"} text-${
        darkMode ? "black" : "white"
      } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export { DarkModeToggle };
export default Weather;
