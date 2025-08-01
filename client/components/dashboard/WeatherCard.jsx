import React, { useState, useEffect } from "react"; // Importación de React y los hooks useState y useEffect
import { toast } from "react-hot-toast";
import axios from "axios"; 

// Componente WeatherCard para mostrar la información del clima
const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null); // Estado para almacenar datos del clima
  const [city, setCity] = useState("Rafaela"); // Estado para manejar la ciudad seleccionada

  const API_KEY = "74b1d892aaebf32becf6f483e14e1f93"; // API Key para acceder a OpenWeatherMap

  // Obtener datos del clima al cargar el componente o cambiar la ciudad
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data); // Almacena los datos obtenidos en el estado
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast("Ciudad no encontrada. Por favor verifica el nombre."); // Muestra un alerta si la ciudad no existe
        } else {
          console.error("Error al obtener los datos del clima:", error); // Manejo de otros errores en la solicitud
        }
      }      
    };

    fetchWeatherData();
  }, [city]); // Ejecuta la función cuando cambia la ciudad

  // Manejar cambios en el campo de texto de la ciudad
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  if (!weatherData) {
    return <div className="text-center">Cargando datos del clima...</div>; // Muestra mensaje de carga
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md">
      {/* Campo para cambiar la ciudad */}
      <div className="p-4 bg-white flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Ingresa una ciudad"
          value={city}
          onChange={handleCityChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 flex-1 weather-input"
        />
        <button
          onClick={() => setCity(city)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 weather-button"
        >
          Buscar
        </button>
      </div>

      {/* Paisaje */}
      <section className="relative h-64 mx-4 bg-blue-200 rounded-lg overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
        <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-yellow-400 shadow-md"></div>
        <div className="absolute bottom-0 w-full h-20 bg-green-600 rounded-tl-full rounded-tr-full"></div>
        <div className="absolute bottom-5 w-3/4 h-10 bg-green-500 rounded-tl-full rounded-tr-full"></div>
      </section>

      {/* Información del clima */}
      <section className="p-6 bg-white flex flex-wrap">
        <div className="flex items-center gap-4 weather-card">
          <div className="p-3 bg-blue-500 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M22 14.3529C22 17.4717 19.4416 20 16.2857 20H11M14.381 9.02721C14.9767 8.81911 15.6178 8.70588 16.2857 8.70588C16.9404 8.70588 17.5693 8.81468 18.1551 9.01498M7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C3.91878 11.5294 2 13.4256 2 15.7647C2 18.1038 3.91878 20 6.28571 20H7M7.11616 11.6089C6.88706 10.9978 6.7619 10.3369 6.7619 9.64706C6.7619 6.52827 9.32028 4 12.4762 4C15.4159 4 17.8371 6.19371 18.1551 9.01498M7.11616 11.6089C7.68059 11.7184 8.20528 11.9374 8.66667 12.2426M18.1551 9.01498C18.8381 9.24853 19.4623 9.60648 20 10.0614"
              ></path>
            </svg>
          </div>
          <p className="text-lg font-bold">{weatherData.weather[0].main}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-gray-500 text-sm">{city}</p>
          <p className="text-2xl font-bold">{weatherData.main.temp}°C</p>
        </div>
      </section>
    </div>
  );
};

export default WeatherCard;
