import "./WeatherInformations5Days.css";

function WeatherInformations5Days({ weather5Days }) {
  console.log(weather5Days);

  let dailyforcast = {};

  for (let forcast of weather5Days.list) {
    const datee = new Date(forcast.dt * 1000).toLocaleDateString();
    if (!dailyforcast[datee]) {
      dailyforcast[datee] = forcast;
    }
  }

  const nextfivedaysForecast = Object.values(dailyforcast).slice(0,5);
  
function convertdate(date){
 
  const newdate = new Date(date.dt * 1000).toLocaleDateString('pt-BR', {weekday: 'long', day:"2-digit"})

  return newdate
}

  return (
    <div className="weather-containerr">
      <h3>Próximos 5 dias</h3>
      <div className="weather-list">
{nextfivedaysForecast.map(forcast => (

<div key={forcast.dt} className="weather-item" >
  <p className="forecast-day"> {convertdate(forcast)} </p>

<img
  src={`http://openweathermap.org/img/wn/${forcast.weather[0].icon}.png`}
  style={{ filter: "hue-rotate(47deg) saturate(1300%) brightness(1.05)" }}
/>
  
  <p className="forecast-description">{forcast.weather[0].description}</p>
<br/>
  <p> mín {Math.round(forcast.main.temp_min)}°C / máx {Math.round(forcast.main.temp_max)}°C</p>

</div>


) )}
</div>
    </div>
  )
}

export default WeatherInformations5Days;
