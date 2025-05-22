import apiEndpoints from "./apiCalls.js";
import utils from "./utils.js";

const locationInput = document.getElementById("location-input");
const getWeatherButton = document.getElementById("get-weather-btn");
const currLocationBtn = document.getElementById("current-location-btn");
const cityNameInput = document.getElementById("container");



function clearPreviousTable() {
    const existingTable = document.getElementById("city-names-table");
    if (existingTable) {
        existingTable.remove();
    }
}

function showError(message) {
    const errorElement = utils.createNewElement("div", ["error-display"]);
    errorElement.textContent = message;
    cityNameInput.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 2000);
}

function createCityTable(results) {
    const headers = ["Name", "State", "Country", "Latitude", "Longitude"];
    const table = utils.createNewElement("table", ["city-names-table"]);
    table.setAttribute("id", "city-names-table");

    const thead = utils.createNewElement("thead", ["city-names-table-header"]);
    const headerRow = utils.createNewElement("tr");
    headers.forEach(header => {
        const th = utils.createNewElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = utils.createNewElement("tbody", ["city-names-table-body"]);
    results.forEach(result => {
        const row = utils.createNewElement("tr");
        const rowData = [result.name, result.state, result.country, result.lat, result.lon];

        rowData.forEach(data => {
            const td = utils.createNewElement("td");
            td.textContent = data;
            row.appendChild(td);
        });

        row.addEventListener("click", () => {
            window.location.href = `./showWeather.html?lat=${result.lat}&lon=${result.lon}`;
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}


locationInput.addEventListener("input", function (event) {
    if(locationInput.value.trim().length > 0) {
        getWeatherButton.classList.remove("display-none");
        getWeatherButton.disabled = false
    } else {
        getWeatherButton.classList.add("display-none");
        getWeatherButton.disabled = true
    }
});

getWeatherButton.addEventListener("click", async function () {
    const location = locationInput.value;
    try {
        const results = await apiEndpoints.getAllCities(location);
        clearPreviousTable();
        if (results.length === 0) throw new Error("City Not Found");

        const table = createCityTable(results);
        cityNameInput.appendChild(table);

    } catch (error) {
        console.log(error.message);
        if (error.message == "City Not Found") {
            let errorElement = utils.createNewElement("div", ["error-display"]);
            errorElement.textContent = "City Not Found";
            console.log(errorElement)
            cityNameInput.appendChild(errorElement);
            setTimeout(() => {
                errorElement.remove();
            }, 2000);
        }
    }

});

currLocationBtn.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition((position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        window.location.href = `./showWeather.html?lat=${lat}&lon=${lon}`;
    }));
});

