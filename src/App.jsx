import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import WeatherInformations from "./components/WeatherInformations/WeatherInformations";
import WeatherInformations5Days from "./components/WeatherInformations5Days/WeatherInformations5Days";

function App() {
  const [weather, setWeather] = useState();
  const [weather5Days, setWeather5Days] = useState();
  const [localTime, setLocalTime] = useState("");
  const [rainChance, setRainChance] = useState(null);
  const inputRef = useRef();

  async function searchLocalTimeAndRain(lat, lon) {
    const key = "38cde37e61fe4ce99a8225813251306"; // WeatherAPI
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=1&lang=pt`;

    try {
      const response = await axios.get(url);
      const time = response.data.location.localtime;
      const hourOnly = time.split(" ")[1];
      const rain = response.data.forecast.forecastday[0].day.daily_chance_of_rain;

      setLocalTime(hourOnly);
      setRainChance(rain);
    } catch (error) {
      console.error("Erro ao buscar hora local ou chance de chuva:", error);
      setLocalTime("Indisponível");
      setRainChance(null);
    }
  }

  async function searchCity() {
    const city = inputRef.current.value;
    const key = "610532f197f9ff53d5b683d790f1fc31"; // OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;
    const url5days = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`

const apiinfo5days = await axios.get(url5days)

console.log(url5days)
try {
    const apiinfo5days = await axios.get(url5days);
    setWeather5Days(apiinfo5days.data);

    const apiInfo = await axios.get(url);
    setWeather(apiInfo.data);

    const { lat, lon } = apiInfo.data.coord;
    await searchLocalTimeAndRain(lat, lon);

  } catch (error) {
    console.error("Erro ao buscar dados da cidade:", error);
    alert("Erro ao buscar dados da cidade.");
  }
}

  return (
    <div className="conteiner">
      <h1>Previsão do tempo</h1>
      <input ref={inputRef} type="text" placeholder="Digite o nome da sua cidade" />
      <button className="botao-laranja" onClick={searchCity}>Buscar</button>
      {weather && <WeatherInformations weather={weather} localTime={localTime} rainChance={rainChance}/>}
      {weather5Days && <WeatherInformations5Days weather5Days={weather5Days}/>}
    </div>
  );
}

export default App;
