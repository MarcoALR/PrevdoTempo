import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import WeatherInformations from "./components/WeatherInformations/WeatherInformations";
import WeatherInformations5Days from "./components/WeatherInformations5days/WeatherInformations5days";

function App() {
  const [weather, setWeather] = useState();
  const [weather5Days, setWeather5Days] = useState();
  const [localTime, setLocalTime] = useState("");
  const [rainChance, setRainChance] = useState(null);
  const [error, setError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

async function searchLocalTimeAndRain(lat, lon) {
  const key = "38cde37e61fe4ce99a8225813251306"; // WeatherAPI
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=1&lang=pt`;

  try {
    const response = await axios.get(url);
    const localDateTime = response.data.location.localtime;  
    const rain = response.data.forecast.forecastday[0].day.daily_chance_of_rain;

    setLocalTime(localDateTime); 
    setRainChance(rain);
  } catch (error) {
    console.error("Erro ao buscar hora local ou chance de chuva:", error);
    setLocalTime("Indisponível");
    setRainChance(null);
  }
}

  async function searchCity(cityParam) {
    const city = cityParam || inputRef.current.value;
    const key = "610532f197f9ff53d5b683d790f1fc31"; // OpenweathermapAPI
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;
    const url5days = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`;

    try {
      const apiinfo5days = await axios.get(url5days);
      setWeather5Days(apiinfo5days.data);

      const apiInfo = await axios.get(url);
      setWeather(apiInfo.data);
      setError(false);
      setSuggestions([]);

      const { lat, lon } = apiInfo.data.coord;
      await searchLocalTimeAndRain(lat, lon);
    } catch (error) {
      console.error("Erro ao buscar dados da cidade:", error);
      setError(true);
      setWeather(null);
      setWeather5Days(null);
    }
  }

  async function fetchSuggestions(query) {
    const key = "610532f197f9ff53d5b683d790f1fc31";
    setInputValue(query);
    if (query.length < 2) return setSuggestions([]);

    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${key}`;
      const res = await axios.get(url);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
      setSuggestions([]);
    }
  }

  function clearInput() {
    setInputValue("");
    inputRef.current.value = "";
    setSuggestions([]);
  }

  return (
    <div className="conteiner">
      <h1>Previsão do tempo</h1>

      <div className="search-container">
       <div className="autocomplete-container input-com-clear">
  <input
    ref={inputRef}
    type="text"
    value={inputValue}
    placeholder="Digite o nome da sua cidade"
    onChange={(e) => fetchSuggestions(e.target.value)}
  />
 {inputValue && (
  <button
    onClick={clearInput}
    style={{
      position: "absolute",
      top: "50%",
      right: "3%",
      transform: "translateY(-50%)",
      border: "none",
      background: "linear-gradient(to right, #f59e0b, #d97706)",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "bold",
      width: "21px",
      height: "18px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0,
      lineHeight: 1,
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
    }}
  >
    ×
  </button>
)}


          {suggestions.length > 0 && (
            <ul className="sugestoes">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    const nomeCompleto = `${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`;
                    inputRef.current.value = nomeCompleto;
                    setInputValue(nomeCompleto);
                    searchCity(nomeCompleto);
                    setSuggestions([]);
                  }}
                >
                  {item.name} {item.state ? `- ${item.state}` : ""} ({item.country})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="botao-laranja" onClick={() => searchCity()}>
          Buscar
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Cidade não encontrada. Verifique se digitou corretamente.
        </p>
      )}

      {weather && (
        <WeatherInformations
          weather={weather}
          localTime={localTime}
          rainChance={rainChance}
        />
      )}

      {weather5Days && (
        <WeatherInformations5Days weather5Days={weather5Days} />
      )}
    </div>
  );
}

export default App;
