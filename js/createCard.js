const weather = {};

async function addCity(city, flag){


	let data = city;


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
		window.alert('Такой город уже есть');

	}
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

async function addFavorites() {

	let cityData= '';

	let city = document.querySelector('.favorites__form__input').value.toLowerCase();
	if (city !== ''){		
		cityData = await getApi(city);
		addCity(cityData , 1);

	}	
	document.querySelector('.favorites__form__input').value = "";
}