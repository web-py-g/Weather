
// document.querySelector(".main__city").onload = function(){
// 	setTimeout(function(){
// 		var preloader = document.querySelector(".preloader");
// 		if (!preloader.classList.contains('done')) {
// 			preloader.classList.add('done');
// 		}
// 	}, 1000);
// }

function loadMain(Parent, loadSelect){
	const Select = document.querySelector(loadSelect);
	const defVal = Select.style.display;

	Select.style.display = 'none';
	const loader = document.getElementById('loader').content.cloneNode(true);

	Parent.appendChild(loader);

	setTimeout(async () => {
    await geoFindMe();
    Parent.removeChild(Parent.querySelector('.loader'));
    Select.style.display = defVal;
  }, 1000);
}

loadMain(document.querySelectorAll('section')[0], ".main__city .wrapper");


const weather = {};

const apikey = '23b165255fbf21ce4cfa7be39b155b62';

// geoFindMe();

document.querySelector(".favorites__form button").addEventListener('click', add_favorites);



function geoFindMe() {

	CoordLink = '';
	function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		CoordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&lang=ru`;
	
		fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			document.querySelector('.info__titel').textContent = data.name;
			document.querySelector('.temp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
			document.querySelector('.wind').textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
			document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
			document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.info__img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}
		)
	}

	function error() {
		CoordLink = `https://api.openweathermap.org/data/2.5/weather?q=Санкт-Петербург&appid=${apikey}&lang=ru`;

		fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){

			document.querySelector('.info__titel').textContent = data.name;
			document.querySelector('.temp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
			document.querySelector('.wind').textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
			document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
			document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.info__img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}	
		)
	}
	
	navigator.geolocation.getCurrentPosition(success, error);
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


	let city = document.querySelector('.favorites__form__input').value.toLowerCase();


	if (city !== ''){
		if( localStorage.getItem(city)){
			window.alert('Такой городу же есть');

		}
		else{
			localStorage.setItem(city, city);
			add_city(city);
		}
	}
	
	document.querySelector('.favorites__form__input').value = "";
	
}


function add_city(city){

	city.toLowerCase();
	
	let api_city = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru`;

	fetch(api_city)
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

	console.log(clone.querySelector(".favorites__item__header h3").textContent.toLowerCase());

	clone.querySelector('button').onclick = () => {
    	fav_list.removeChild(clone);
    	localStorage.removeItem(clone.querySelector(".favorites__item__header h3").textContent);
	};
}





function default_add(){

	const refreashCurrentBtn = document.querySelector('.refresh');
  	refreashCurrentBtn.onclick = () => { loadMain(document.querySelectorAll('section')[0], ".main__city .wrapper"); };

	const default_city = ['москва', 'крым', 'тюмень', 'киев'];

	if(localStorage.length == 0)
		for (let i = 0; i < default_city.length; i++)
			localStorage.setItem(default_city[i], default_city[i]);
				
	for (let i = 0; i < localStorage.length; i++) {
		add_city(localStorage.key(i));
	}
}


default_add();

console.log(localStorage)