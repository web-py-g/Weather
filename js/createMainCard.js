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