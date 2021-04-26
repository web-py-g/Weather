const serverURL = 'https://weather-web-py.herokuapp.com/';
const defaultCity = 'Moscow';

const weather = {};

async function addCity(city){

    let weather;   
    let weatherReq = await fetch(`${serverURL}${city}`, {
        method: 'GET'
    });
    weather = await weatherReq.json();

    displayFav(weather);
}

function convertWind (wind){
    const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'};
    let result = '';

    if (wind === 0) {result += dirs.N;}
    if ((wind > 0) && (wind <= 45) ) {result += dirs.N + '/' + dirs.E;}
    if ((wind > 45) && (wind <= 90) ) {result += dirs.E;}
    if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S;}
    if ((wind > 135) && (wind <= 180) ) {result +=dirs.S;}
    if ((wind > 180) && (wind <= 225) ) {result += dirs.S + '/' + dirs.W;}
    if ((wind > 225) && (wind <= 270) ) {result +=dirs.W;}
    if ((wind > 270) && (wind <= 315) ) {result += dirs.N + '/' + dirs.W;}
    if ((wind > 315) && (wind <= 360) ) {result +=dirs.N;}

    return result;
}

async function displayFav(weather){

    const template = document.querySelector('#favorites__card');

    const cityElem = template.content.querySelector(".favorites__item__titel");
    const iconElem = template.content.querySelector(".item__img");
    const tempElem = template.content.querySelector(".favorites_temp");
    const windElem = template.content.querySelector(".wind");
    const cloudElem = template.content.querySelector(".cloud");
    const presElem = template.content.querySelector(".pressure");
    const humElem = template.content.querySelector(".humidity");
    const coordElem = template.content.querySelector(".coordinates");
    const idElem = template.content.querySelector(".idCity");

    cityElem.textContent = weather.cityName;
    iconElem.src = weather.icon;
    tempElem.innerHTML = weather.temp;
    windElem.innerHTML = weather.wind;
    cloudElem.innerHTML = weather.cloud;
    presElem.innerHTML = weather.pressure;
    humElem.innerHTML = weather.humidity;
    coordElem.innerHTML = `[${(weather.coords.lat)}, ${(weather.coords.lon)}]`;
    idElem.innerHTML = weather.id;

    var clone = template.content.querySelector("li").cloneNode(true);

    const loader = document.getElementById('loader').content.cloneNode(true);

   

    var favList = document.querySelector(".favorites__list");
    favList.appendChild(clone);

    clone.append(loader);
    const div = clone.querySelector('.favorites__item__header');
    const ul = clone.querySelector('ul');
    
    ul.style.display = 'none';
    div.style.display ='none';  
    setTimeout(async () => {
      div.style.display ='flex';
      ul.style.display = 'block'
      clone.removeChild(clone.querySelector('.loader'));
    }, 1000);


    clone.querySelector('button').onclick = async () => {
        favList.removeChild(clone);

        await fetch(`${serverURL}favourites?city=${weather.cityName}`, {
            method: 'DELETE'
        });
    };
}

async function addFavorites() {
    let cityData= '';

    let newCity = document.querySelector('.favorites__form__input').value.toLowerCase();
    document.querySelector('.favorites__form__input').value = "";
    
    if (newCity !== '') {        
        try{
            const resultRes = await fetch(`${serverURL}favourites?city=${newCity}`, {
                method: 'POST'
            });
            const result = await resultRes.text();
            if (result !== undefined) {
                await addCity(`weather/city?q=${newCity}`);
            }
        }
        catch{
            window.alert('Citi is not found');
        }
       
    }
    
}


function fetchLoad(mainCity){

    document.querySelector('.info__titel').textContent = mainCity.cityName;
    document.querySelector('.temp').innerHTML = mainCity.temp; 
    document.querySelector('.wind').textContent = mainCity.wind;
    document.querySelector('.cloud').textContent = mainCity.cloud;
    document.querySelector('.pressure').textContent = mainCity.pressure;
    document.querySelector('.humidity').textContent = mainCity.humidity;
    document.querySelector('.coordinates').textContent = `[${(mainCity.coords.lat)}, ${(mainCity.coords.lon)}]`;
    document.querySelector('.info__img').src = mainCity.icon;
        
}


async function geoFindMe() {

    CoordLink = '';
    async function success(position) {
        
        const mainRes = await fetch(`${serverURL}weather/coordinates?lat=${position.coords.latitude}&long=${position.coords.longitude}`, {
            method: 'GET'
        });
        const mainCity = await mainRes.json()
        fetchLoad(mainCity);
    }

    async function error() {
        
        const mainRes = await fetch(`${serverURL}weather/city?q=Saint Petersburg`, {
            method: 'GET'
        });
        const mainCity = await mainRes.json()
        fetchLoad(mainCity);
    } 
    navigator.geolocation.getCurrentPosition(success, error);
}


async function defaultAdd(){

    const refreashCurrentBtn = document.querySelector('.refresh');
    refreashCurrentBtn.onclick = () => {loadMainFunc(document.querySelectorAll('section')[0], ".main__city .wrapper")};
     
    const addBut = document.querySelector(".add");
    addBut.onclick = async (e) => {
        e.preventDefault();
        await addFavorites();
    };

    const favRes = await fetch(`${serverURL}favourites`, {
        method: 'GET'
    });
    
    const favArray = await favRes.json();

    favArray.map( async item => {
        await displayFav(item);
      });

}

defaultAdd();

function loadMainFunc(parent, loadSelect){
    const Select = document.querySelector(loadSelect);
    const defVal = Select.style.display;

    Select.style.display = 'none';
    const loader = document.getElementById('loader').content.cloneNode(true);

    parent.append(loader);

    setTimeout(async () => {
    await geoFindMe();
    parent.removeChild(parent.querySelector('.loader'));
    Select.style.display = defVal;
  }, 1000);
}

loadMainFunc(document.querySelectorAll('section')[0], ".main__city .wrapper");