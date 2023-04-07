 const userTab=document.querySelector("[data-userweather]");
 const searchTab=document.querySelector("[data-searchweather]");
 const userContainer=document.querySelector(".weather-container");
 const grantAccessContainer=document.querySelector(".grant-location-container"); 
 const searchForm=document.querySelector("[data-searchform]");
 const loadingScreen=document.querySelector(".loading-container");
 const userInfoContainer=document.querySelector(".user-info-container");

 
 let currentTab=userTab;
 const API_KEY ="ab9a0b201608c44775bc3875f966b62d";
currentTab.classList.add("current-tab");
//pending
getfromSessionStorage();
function switchTab(clickedTab){
  if(clickedTab != currentTab)
   {  
    currentTab.classList.remove("current-tab");
     currentTab=clickedTab;
     currentTab.classList.add("current-tab");
     if(!searchForm.classList.contains("active"))
       { grantAccessContainer.classList.remove("active");
         userInfoContainer.classList.remove("active");
         searchForm.classList.add("active");
       }
       else{
         //main phele search vale tab par tha,ab main your weather vale tab par hu
         searchForm.classList.remove("active");
         userInfoContainer.classList.remove("active");
         //ab main your weather main aa gya hu, to weather bhi display krna pdega ,
         // so let's check local storage first for coordinates if we have saved or not
         getfromSessionStorage();
       }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
  switchTab(searchTab);
});
//check if coordinates are already present in session storage
function getfromSessionStorage()
{  const localCoordinates=sessionStorage.getItem("user-coordinates");
  if(!localCoordinates)
  grantAccessContainer.classList.add("active");
  else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
async function fetchUserWeatherInfo(coordinates){
   const{lat,long}=coordinates;
   //make grant location invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API CALL
    try{
      const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
      const data= await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(err){
      loadingScreen.classList.remove("active");
      //hw
    }
  }

  function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temperature]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    //now put values in elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
  }

  function getlocation(){
    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
      //hw show an alert for no acces of geolaction
    }
  }
  function showPosition(position){
      const userCoordinates={ 
        lat : position.coords.latitude,
       long : position.coords.longitude,
      }
      sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
      fetchUserWeatherInfo(userCoordinates);
  }
  const grantAccessButton=document.querySelector("[data-grantAccess]");
  grantAccessButton.addEventListener("click",getlocation);


  const searchInput=document.querySelector("[data-searchinput]");
  
  searchForm.addEventListener("submit" , (e)=>{
    console.log("enter in the func2.");
    e.preventDefault();
     let cityName=searchInput.value;
     if(cityName=== "")
     return;
     else
      fetchSearchWeatherInfo(cityName);
     
  })
  async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
   try{
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    console.log(response);
    const data= await response.json();
    console.log(data);
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
   }
   catch(err){
      
   }
  }