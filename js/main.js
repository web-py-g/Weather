
const weather = {};
const apikey = '23b165255fbf21ce4cfa7be39b155b62';


function fetchLoad(Link){
	fetch(Link)
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
		})
}


function geoFindMe() {

	CoordLink = '';
	function success(position) {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		CoordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&lang=ru`;
		fetchLoad(CoordLink);
	}

	function error() {
		CoordLink = `https://api.openweathermap.org/data/2.5/weather?q=Санкт-Петербург&appid=${apikey}&lang=ru`;
		fetchLoad(CoordLink);
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

function addFavorites() {

	let city = document.querySelector('.favorites__form__input').value.toLowerCase();
	if (city !== ''){		
		addCity(city, 1);
	}	
	document.querySelector('.favorites__form__input').value = "";
}


function addCity(city, flag){

	let apiCity ='';

	city.toLowerCase();



	if (parseInt(city)) {
		console.log('id');
		apiCity = `https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apikey}&lang=ru`;				
	}
	else{
		console.log('name');

		apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru`;		
	}


	fetch(apiCity)
	.then(function(resp) {
		if (resp.status != 200) {
			localStorage.removeItem(city);
			window.alert('Данный город не найден!');
			return null;
		}
		return resp.json();
	})
	.then(function(data){

		if (((localStorage.getItem(data.id)) && (flag == 0)) || (!localStorage.getItem(data.id)) ) {
			weather.city = data.name;
			weather.temp = Math.round(data.main.temp - 273) + '&deg;C'; 
			weather.wind = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			weather.cloud = (data.clouds.all) + '%' ;
			weather.pres = (data.main.pressure) + ' мм.рт.ст.' ;
			weather.hum = (data.main.humidity) + '%' ;
			weather.coord = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			weather.img = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
			weather.id = data.id;

			localStorage.setItem(weather.id, weather.city);

			displayFav();
		}
		else if((localStorage.getItem(data.id)) && (flag == 1)) {
			console.log('Такой город уже есть');

		}
		
	})
}


function displayFav(){
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

	
	cityElem.textContent = weather.city;
	iconElem.src = weather.img;
	tempElem.innerHTML = weather.temp;
	windElem.innerHTML = weather.wind;
	cloudElem.innerHTML = weather.cloud;
	presElem.innerHTML = weather.pres;
	humElem.innerHTML = weather.hum;
	coordElem.innerHTML = weather.coord;
	idElem.innerHTML = weather.id;



	var clone = template.content.querySelector("li").cloneNode(true);
	var favList = document.querySelector(".favorites__list");
	favList.appendChild(clone);

	clone.querySelector('button').onclick = () => {
    	favList.removeChild(clone);
    	localStorage.removeItem(clone.querySelector(".idCity").textContent);
	};
}

function defaultAdd(){

	const refreashCurrentBtn = document.querySelector('.refresh');
  	refreashCurrentBtn.onclick = () => { loadFunc(document.querySelectorAll('section')[0], ".main__city .wrapper"); };

  	const addBut = document.querySelector(".favorites__form button");
  	addBut.onclick = () => {addFavorites();};

	const defaultCity = ['москва', 'крым', 'тюмень', 'киев'];
	const defaultCityId = ['524901', '540259', '1488754', '703448'];

	if(localStorage.length == 0)
		for (let i = 0; i < defaultCity.length; i++)
			localStorage.setItem(defaultCityId[i], defaultCity[i]);


	for (let i = 0; i < localStorage.length; i++) {
		addCity(localStorage.key(i), 0);
	}
}

function loadMainFunc(Parent, loadSelect){
	const Select = document.querySelector(loadSelect);
	const defVal = Select.style.display;

	Select.style.display = 'none';
	const loader = document.getElementById('loader').content.cloneNode(true);

	Parent.append(loader);

	setTimeout(async () => {
    await geoFindMe();
    Parent.removeChild(Parent.querySelector('.loader'));
    Select.style.display = defVal;
  }, 1000);
}

loadMainFunc(document.querySelectorAll('section')[0], ".main__city .wrapper");


loadMainFunc(document.querySelectorAll('section')[1], ".favorites__list");


defaultAdd();