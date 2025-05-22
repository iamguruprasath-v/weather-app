import utils from "./utils.js";
import apiEndpoints from "./apiCalls.js";
import apiCalls from "./apiCalls.js";

const showDaysNav = document.getElementById("days-show");
const showTimeNav = document.getElementById("time-show");
const mapImage = document.getElementById("map-image");
const placeDetails = document.getElementById("place-details");
const quantitativeDetails = document.getElementById("quantitative-details");
const descriptiveDetails = document.getElementById("descriptive-details");
const unitsDropDown = document.getElementById("Units");


const params = new URLSearchParams(window.location.search);

let weatherData;
let lat, lon;
[lat, lon] = utils.getAllParams(params, ["lat", "lon"]);
let units = {
    name: "kelvin",
    identity: "K"
}
if(params.has("unit")) {
    units.name = params.get("unit");
    if(units.name == "celsius") {
        units.identity = "°C";
        unitsDropDown.children[1].setAttribute("selected", "selected");
    }
    else if(units.name == "fahrenheit") {
        units.identity = "°F";
        unitsDropDown.children[2].setAttribute("selected", "selected");
    }
    else if(units.name == "kelvin") {
        units.identity = "K";
        unitsDropDown.children[0].setAttribute("selected", "selected");
    }
    else {
        units.name = "kelvin";
        units.identity = "K";
    }
}

let windSpeedUnit = 'meter/sec';
// console.log(lat, lon);
mapImage.setAttribute("src", `https://maps.geoapify.com/v1/staticmap?style=klokantech-basic&width=600&height=400&center=lonlat:${lon},${lat}&zoom=11&styleCustomization=background:%23d2cebf|landcover_grass:%23a6b390|park:%23bed09d|landcover_wood:%2391a56d|water:%2397afc0|landuse:%236c593a|landuse_overlay_national_park:%237b8936|waterway:none|building:%23a89e8b|housenumber:%23e2dad3|road_bridge_area:%23ffffff&apiKey=f28ac67e70e042c9a844122a5ffb5137`)

if(lat && lon) {
    apiEndpoints.getWeatherDataWithCoordinates(lat, lon, units.name)
        .then(data => {
            weatherData = data;
            console.log(weatherData);
            placeDetails.appendChild(utils.createNewElement("h4", ["fs-1"], `Name: ${weatherData.city.name}`));
            placeDetails.appendChild(utils.createNewElement("h4", ["fs-2"], `Country: ${weatherData.city.country}`));
            placeDetails.appendChild(utils.createNewElement("h4", ["fs-2"], `Total Polulation: ${weatherData.city.population}`));
            placeDetails.appendChild(utils.createNewElement("h4", ["fs-2"], `Today Sunrise at: ${new Date(weatherData.city.sunrise * 1000).toLocaleTimeString()}`));
            placeDetails.appendChild(utils.createNewElement("h4", ["fs-2"], `Today Sunset at: ${new Date(weatherData.city.sunset * 1000).toLocaleTimeString()}`));
            let days = getDays();
            updateNav(days);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
} else {
    console.error("Latitude and Longitude not provided in URL parameters.");
}

function getDays() {
    let days = {};
    const baseDate = new Date(weatherData.list[0].dt_txt.substring(0, 10)); // Get base date
    for (let i = 0; i < 5; i++) {
        const date = new Date(baseDate); // Clone baseDate
        date.setDate(date.getDate() + i); // Add i days
        const isoDate = date.toISOString().substring(0, 10); // Format: "YYYY-MM-DD"
        days[`day${i + 1}`] = utils.getDayFormat(isoDate); // Convert to "Wednesday"
    }
    return days;
}

function updateQuantitativeContent(weatherInfo) {
    quantitativeDetails.innerHTML = "";
    console.log("Updating content with weather info: ", weatherInfo);
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Cloudiness: ${weatherInfo.clouds.all}%`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Humidity: ${weatherInfo.main.humidity}%`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Pressure: ${weatherInfo.main.sea_level} hPa`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Temperature: ${weatherInfo.main.temp} ${units.identity}`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Max Temp: ${weatherInfo.main.temp_max} ${units.identity}`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Min Temp: ${weatherInfo.main.temp_min} ${units.identity}`));   
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Rain: ${weatherInfo.rain ? weatherInfo.rain["3h"] : 0} mm`));
    quantitativeDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Wind Speed: ${weatherInfo.wind.speed} ${windSpeedUnit}`));
}

function updateDescriptiveContent(weatherInfo) {
    descriptiveDetails.innerHTML = "";
    descriptiveDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Main Weather Condition: ${weatherInfo.weather[0].main}`));
    descriptiveDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Description: ${weatherInfo.weather[0].description}`));
    descriptiveDetails.appendChild(utils.createNewElement("img", [], `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@4x.png`));
    descriptiveDetails.appendChild(utils.createNewElement("p", ["fs-5"], `Weather Overview: ${apiCalls.getWeatherOverview(weatherInfo.weather[0].id)}`));
}

function getWeatherForTime(e, onDateWeatherInfo) {
    document.querySelectorAll(".time-item").forEach(item => {
        item.classList.remove("active", "fw-bold", "border-bottom", "border-3", "border-danger");
    });
    // console.log("Clicked on time: ", e.target.innerText);
    e.target.classList.add("active", "fw-bold", "border-bottom", "border-3", "border-dark", "rounded-1");
    let weatherInfo = onDateWeatherInfo.find(item => {
        return item.dt_txt.includes(e.target.innerText);
    })
    updateQuantitativeContent(weatherInfo);
    updateDescriptiveContent(weatherInfo);
}

function updateOndateWeatherInfo(onDateWeatherInfo) {
    showTimeNav.innerHTML = "";
    let activeSet = false;
    onDateWeatherInfo.forEach(item => {
        let time = utils.createNewElement("li", ["nav-item", "nav-link", "time-item"]);
        time.innerText = item.dt_txt.substring(11, 16);
        time.addEventListener("click", (e) => {
            getWeatherForTime(e, onDateWeatherInfo)
        });
        showTimeNav.appendChild(time);
        if(!activeSet) {
            time.click();
            activeSet = true;
        }
    });
}

function getWeatherForDay(e) {
    document.querySelectorAll(".day-item").forEach(item => {
        item.classList.remove("active", "fw-bold", "border-bottom", "border-3", "border-danger");
    });
    // console.log("Clicked on day: ", e.target.innerText);
    e.target.classList.add("active", "fw-bold", "border-bottom", "border-3", "border-dark", "rounded-1");
    let date = new Date(e.target.innerText);
    // console.log("Selected date: ", date);
    let formattedDate = date.toLocaleDateString("en-CA").substring(0, 10);

    let onDateWeatherInfo = weatherData.list.filter(item => {
        return item.dt_txt.substring(0, 10) === formattedDate;
    })
    updateOndateWeatherInfo(onDateWeatherInfo)

    // console.log(onDateWeatherInfo);
}


//Updating Nav First
function updateNav(days) {
    showDaysNav.innerText = "";
    for (let i = 0; i < 5; i++) {
        let day = utils.createNewElement("li", ["nav-item", "nav-link", "day-item"]);
        day.innerText = days[`day${i + 1}`];
        day.addEventListener("click", getWeatherForDay);
        showDaysNav.appendChild(day);
        if(i == 0) day.click();
    }
}

function handleUnitChange(e) {
    // debugger;
    console.log("Unit changed to: ", e.target.value);
    window.location.href = `showWeather.html?lat=${lat}&lon=${lon}&unit=${e.target.value}`;
}


unitsDropDown.addEventListener("change", handleUnitChange);



