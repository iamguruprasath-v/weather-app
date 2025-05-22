const APIKEY = "524cf4f313ec3ad1221f1f444f1fba75";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast/";
const WEATHER_OVERVIEW_BASE_URL = "https://api.openweathermap.org/data/3.0/onecall/overview";


function getAllCities(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKEY}`;
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            throw error;
        });
}

function getWeatherDataWithCoordinates(lat, lon, units) {
    
    let url;
    if(units == "celsius") url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
    else if(units == "fahrenheit") url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
    else url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=standard`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Location not found");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            throw error;
        });
}

function getWeatherOverview(id) {
    if (id >= 200 && id < 300) return "Thunderstorm";
    else if (id >= 300 && id < 400) return "Drizzle";
    else if (id >= 500 && id < 600) return "Rainy";
    else if (id >= 600 && id < 700) return "Snowy";
    else if (id === 701) return "Mist";
    else if (id === 711) return "Smoke";
    else if (id === 721) return "Haze";
    else if (id === 731 || id === 761) return "Dust";
    else if (id === 741) return "Fog";
    else if (id === 751) return "Sand";
    else if (id === 762) return "Ash";
    else if (id === 771) return "Squall";
    else if (id === 781) return "Tornado";
    else if (id === 800) return "Clear";
    else if (id >= 801 && id < 900) return "Cloudy";
    else return "New Weather Type Unlocked";
}


export default { 
    getAllCities, 
    getWeatherDataWithCoordinates ,
    getWeatherOverview,
};
