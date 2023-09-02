const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");



//initially variables need?

let oldTab = userTab;
const API_KEY = "1b1896813242669a756b5c6d5285438b";
oldTab.classList.add("current-tab");

//initially seesion storage mai coord store hai for that -> 
getfromSessionStorage();



// Switch the current tab and other tab 
function switchTab(newTab){

    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){

            // is serachForm container is invisible then make it visible

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }


        else{
            // I am on search tab , switch to your weather tab

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //now i am in weather tab , then we have to dispaly weather info , so let's check local storage first for coordinates
            //if we have saved them there

            getfromSessionStorage();
        }
    }

}

userTab.addEventListener('click' , () => {
    //passed clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click' , () =>{

    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage

function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){

        //if local coordinates are not there
        //show grantLocation screen

        grantAccessContainer.classList.add("active");

    }
    else{

        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}

 async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");



    //API CALL
    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const  data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }

    catch(err){
        loadingScreen.classList.remove("active");
        //?
    }
}

function renderWeatherInfo(weatherInfo){

    //firstly , we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


   
    console.log(weatherInfo);

    //fetch values from weatherInfo object and put it on UI

    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation(){

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        //show an alert for no geological support available

        // document.alert = "404 Not Found";  
     }
}


function showPosition(position){

    const userCoordinates = {

        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    //Store coordinates in session
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    //to show on UI 
    fetchUserWeatherInfo(userCoordinates);

}


// Grant Access Button
const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);



//search weather

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }

    catch(err){

        //
    }
}