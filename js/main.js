

const weather = {};

const apikey = '23b165255fbf21ce4cfa7be39b155b62';

geoFindMe()

document.querySelector(".favorites__form button").addEventListener('click', add_favorites);
document.querySelector('#find-me').addEventListener('click', geoFindMe);



function geoFindMe() {

	CoordLink = '';

	MainCity = InitParametrs(document.querySelector('.main__city'))

	function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		CoordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
	
		fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			document.querySelector('.info__titel').textContent = data.name;
			MainCity.temp.innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
			MainCity.wind.textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			MainCity.cloud.textContent = (data.clouds.all) + '%' ;
			MainCity.press.textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			MainCity.humidity.textContent = (data.main.humidity) + '%' ;
			MainCity.coords.textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.info__img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}
		)
	}

	function error() {
		CoordLink = `https://api.openweathermap.org/data/2.5/weather?q=Санкт-Петербург&appid=${apikey}`;

		fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){

			document.querySelector('.info__titel').textContent = data.name;
			document.querySelector('.temp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
			MainCity.wind.textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			MainCity.cloud.textContent = (data.clouds.all) + '%' ;
			MainCity.press.textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			MainCity.humidity.textContent = (data.main.humidity) + '%' ;
			MainCity.coords.textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.info__img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}	
		)
	}
	
	navigator.geolocation.getCurrentPosition(success, error);
}

function InitParametrs(Alldesc){
	const keys = ['temp', 'wind', 'cloud', 'press', 'humidity', 'coords'];
	const items = Alldesc.querySelectorAll('span');
	const params = {};
	for (let i = 0; i < keys.length; i += 1) {
	params[keys[i]] = items[i];
	}
	return params;
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

function add_favorites() {

	let city = document.querySelector('.favorites__form__input').value;

	localStorage.setItem(city, city);
	let api_city = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
	add_city(api_city);
	document.querySelector('.favorites__form__input').value = "";
}


function add_city(city_api){
	fetch(city_api)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			weather.city = data.name;
			weather.temp = Math.round(data.main.temp - 273) + '&deg;C'; 
			weather.wind = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			weather.cloud = (data.clouds.all) + '%' ;
			weather.pres = (data.main.pressure) + ' мм.рт.ст.' ;
			weather.hum = (data.main.humidity) + '%' ;
			weather.coord = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			weather.img = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		})
		.then(function(){
			displayFav();
		})
}


function displayFav(){
	const template = document.querySelector('#favorites__card');

	const CityElem = template.content.querySelector(".favorites__item__titel");
	const IconElem = template.content.querySelector(".item__img");
	const TempElem = template.content.querySelector(".favorites_temp");
	const WindElem = template.content.querySelector(".wind");
	const CloudElem = template.content.querySelector(".cloud");
	const PresElem = template.content.querySelector(".pressure");
	const HumElem = template.content.querySelector(".humidity");
	const CoordElem = template.content.querySelector(".coordinates");

	
	CityElem.textContent = weather.city;
	IconElem.src = weather.img;
	TempElem.innerHTML = weather.temp;
	WindElem.innerHTML = weather.wind;
	CloudElem.innerHTML = weather.cloud;
	PresElem.innerHTML = weather.pres;
	HumElem.innerHTML = weather.hum;
	CoordElem.innerHTML = weather.coord;

	var clone = template.content.querySelector("li").cloneNode(true);
	var fav_list = document.querySelector(".favorites__list");
	fav_list.appendChild(clone);

	clone.querySelector('button').onclick = () => {
    	fav_list.removeChild(clone);
    	if(localStorage.removeItem(clone.querySelector(".favorites__item__header h3").innerHTML)) console.log("YES");
	};
}





function default_add(){
	const default_city = ['Moscow', 'Saint Petersburg', 'Tyumen', 'Kyiv'];

	if(localStorage.length == 0)
		for (let i = 0; i < default_city.length; i++)
			localStorage.setItem(default_city[i], default_city[i]);
				
	for (let i = 0; i < localStorage.length; i++) {
		let api_city = `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.key(i)}&appid=${apikey}`;
		add_city(api_city);
	}
}

default_add();