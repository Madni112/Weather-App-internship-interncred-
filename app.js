const temp = document.getElementById("temp")
const feelsLike = document.getElementById("feels-like")
const city = document.getElementById("city")
const humidity = document.getElementById("humidity")
const windspeed = document.getElementById("windspeed")
const search = document.getElementById("search")
const weatherContainer = document.querySelector("#img-container")
const regionCountry = document.getElementById("region-country")
const popup = document.getElementById("popup")
const popupText = document.getElementById("popup-text")
const popupOk = document.getElementById("popup-ok")
const condition = document.getElementById("condition")
let weatherImg = false

search.focus()

function showPopup(msg) {
    popup.style.display = "flex"
    popupText.textContent = msg
    search.blur()
}

async function getWeatherData(e) {
    e.preventDefault()
    if (popup.style.display === "flex") return

    try {
        const name = search.value.replace(/ /g, "")
        if (name === "") {
            showPopup("Please Enter City Name")
            return
        }

        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=a6cbe1054a10402bb01151957261401&q=${search.value}&aqi=no`)
        const data = await res.json()
        if (data.error) {
            showPopup("City not found")
            return
        }

        const input = search.value.toLowerCase()
        const cityLower = data.location.name.toLowerCase()
        const regionLower = data.location.region.toLowerCase()
        if (!input.includes(cityLower) || (input.includes(",") && !input.includes(regionLower))) {
            showPopup("Please Enter Correct City Name")
            return
        }

        if (!weatherImg) {
            weatherImg = document.createElement("img")
            weatherContainer.appendChild(weatherImg)
            weatherImg.classList.add("weather-img")
        }
        if(data.current.is_day === 1 && data.current.condition.text == "Sunny" || data.current.condition.text == "Clear"){
            weatherImg.src = "./sun.png"
        }
        if( data.current.is_day === 0 && data.current.condition.text == "Sunny" || data.current.condition.text == "Clear"){
            weatherImg.src = "./moon.png"
        }
        if(data.current.condition.text == "Cloudy" || data.current.condition.text == "Overcast"){
            weatherImg.src = "./cloud.png"
        }
        if(data.current.condition.text == "Mist" || data.current.condition.text == "Fog" || data.current.condition.text == "Freezing fog"){
            weatherImg.src = "./fog.png"
        }
        if(data.current.condition.text == "Partly cloudy" && data.current.is_day === 1){
            weatherImg.src = "./cloudy sun.png"
        }
        if(data.current.condition.text == "Partly cloudy" && data.current.is_day === 0){
            weatherImg.src = "./cloudy moon.png"
        }
        if(data.current.condition.text == "Patchy rain nearby" || data.current.condition.text == "Light rain" || data.current.condition.text == "Heavy rain" || data.current.condition.text == "Moderate rain" || data.current.condition.text == "Thundery outbreaks possible"){
            weatherImg.src = "./rain.png"
        }
        if(data.current.condition.text == "Patchy light snow" || data.current.condition.text == "Light snow" || data.current.condition.text == "Moderate snow" || data.current.condition.text == "Heavy snow" || data.current.condition.text == "Blizzard" || data.current.condition.text == "Blowing snow" || data.current.condition.text == "Light snow showers"){
            weatherImg.src = "./snow.png"
        }
        else{
            weatherImg.src= "./Weather-icon.png"
        }


        search.placeholder = data.location.name
        temp.textContent = `${data.current.temp_c}°C`
        feelsLike.textContent = `Feels like ${data.current.feelslike_c}°C`
        city.textContent = data.location.name
        humidity.textContent = `${data.current.humidity}%`
        windspeed.textContent = `${data.current.wind_kph} km/h`
        regionCountry.textContent = `${data.location.region} \n ${data.location.country}`
        condition.textContent = data.current.condition.text
        search.value = ""

    } catch {
        showPopup("Unable to fetch weather data")
    }
}

popupOk.addEventListener("click", () => popup.style.display = "none")

document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === "Escape") && popup.style.display === "flex") {
        popup.style.display = "none"
        setTimeout(() => search.focus(), 200)
    }
})

search.addEventListener("keydown", e => {
    if (popup.style.display === "flex" && e.key === "Enter") e.preventDefault()
})

