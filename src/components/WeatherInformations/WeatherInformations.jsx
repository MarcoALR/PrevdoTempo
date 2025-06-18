import './WeatherInformations.css';

function WeatherInformations({ weather, localTime, rainChance }) {
  if (!weather || !weather.main || !weather.weather || !weather.wind) {
    return <p className="carregando">Carregando clima...</p>;
  }

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = (weather.wind.speed * 3.6).toFixed(1);
  const windDeg = weather.wind.deg;
  const cityName = weather.name;

  const getWindDirection = (deg) => {
    const directions = [
      'Norte', 'Nordeste', 'Leste', 'Sudeste',
      'Sul', 'Sudoeste', 'Oeste', 'Noroeste'
    ];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const windDirectionText = getWindDirection(windDeg);

  const rainVolume = weather.rain?.['1h'] || weather.rain?.['3h'] || 0;
  const rainText = rainVolume > 0 ? `${rainVolume} mm` : 'Sem chuva recente';

  const estaChovendoAgora =
    rainVolume > 0 || weather.weather[0].main.toLowerCase().includes("rain");

  return (
    <div className="weather-container">
      <h2>{cityName}</h2>

      {localTime && localTime !== "Indisponível" && (
        <div className="hora-local" style={{ marginBottom: '10px', textAlign: 'center' }}>
          <p style={{ margin: '0', fontSize: '1.1rem' }}>
            🕒 {localTime.split(' ')[1]}
          </p>
          <p style={{ margin: '0', fontSize: '1rem', opacity: 0.8 }}>
            📅 {(() => {
              const [dataPart] = localTime.split(' ');
              const [ano, mes, dia] = dataPart.split('-');
              const meses = [
                'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
              ];
              return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${ano}`;
            })()}
          </p>
        </div>
      )}

      <div className="weather-info">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={`Ícone representando clima: ${weather.weather[0].description}`}
          loading="lazy"
          className="fade-image"
          style={{ filter: "hue-rotate(47deg) saturate(1300%) brightness(1.05)" }}
        />
        <p className="temperaturee" style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#f8fafc',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.82)',
          textAlign: 'center',
          margin: 0
        }}>{temperature}°C</p>
      </div>

      <p className="description">Clima: {weather.weather[0].description}</p>

      <div className="details">
        <p>Sensação Térmica: {feelsLike}°C</p>
        <p>Direção do Vento: {windDirectionText} ({windDeg}°)</p>
        <p>Umidade: {humidity}%</p>
        <p>Volume de Chuva: {rainText}</p>
        <p>Chance de Chuva (previsão): {rainChance !== null ? `${rainChance}%` : 'Indisponível'}</p>
        {estaChovendoAgora && (
          <p className="estachovendo" style={{ color: '#4169E1', fontWeight: 'bold' }}>
            Está chovendo agora ☔
          </p>
        )}
        <p>Vento: {windSpeed} km/h</p>
      </div>
    </div>
  );
}

export default WeatherInformations;
