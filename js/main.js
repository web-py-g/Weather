// if ("geolocation" in navigator) {
//   console.log("Yes")
// } else {
//   console.log("no")
// }

// navigator.geolocation.getCurrentPosition(function(position) {
//   console.log(position.coords.latitude, position.coords.longitude);
// });

// function success(position) {
//   const latitude  = position.coords.latitude;
//   const longitude = position.coords.longitude;

//   console.log(latitude, longitude)
//   // Дальше код, который что-то делает с широтой(latitude) и долготой(longitude)
// }
// success()
function geoFindMe() {

  const status = document.querySelector('#status');
  const mapLink = document.querySelector('#map-link');

  mapLink.href = '';
  mapLink.textContent = '';

	function success(position) {
	const latitude  = position.coords.latitude;
	const longitude = position.coords.longitude;

	status.textContent = '';
	mapLink.href = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=23b165255fbf21ce4cfa7be39b155b62`;
	mapLink.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
	

	fetch(mapLink.href)
	.then(function(resp) {return resp.json()})
	.then(function(data){
		console.log(data);
		
		document.querySelector('.info__titel').textContent = data.name;
		document.querySelector('.temp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
		document.querySelector('.wind').textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
		document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
		document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
		document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
		document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;




	}
	)

	}

	function error() {
	status.textContent = 'Невозможно получить ваше местоположение';
	}

	if (!navigator.geolocation) {
	status.textContent = 'Geolocation не поддерживается вашим браузером';
	} else {
	status.textContent = 'Определение местоположения…';
	navigator.geolocation.getCurrentPosition(success, error);

}
  

}

function convertWind (wind){
	const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'};
	let result = '';

	if (wind === 0) {result += dirs.N;}
	if ((wind > 0) && (wind <= 45) ) {result += dirs.Nn + '/' + dirs.E;}
	if ((wind > 45) && (wind <= 90) ) {result += dirs.E;}
	if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S;}
	if ((wind > 135) && (wind <= 180) ) {result +=dirs.S;}
	if ((wind > 180) && (wind <= 225) ) {result += dirs.Ss + '/' + dirs.W;}
	if ((wind > 225) && (wind <= 270) ) {result +=dirs.W;}
	if ((wind > 270) && (wind <= 315) ) {result += dirs.Nn + '/' + dirs.W;}
	if ((wind > 315) && (wind <= 360) ) {result +=dirs.N;}


	return result;

}
console.log(convertWind(120));

geoFindMe()


document.querySelector('#find-me').addEventListener('click', geoFindMe);

const queryFirst = 'https://community-open-weather-map.p.rapidapi.com/weather?q=';
const queryKey = 'f61af79d09mshd19f67ed0ff9b9ap186a42jsn7b69284cdb10';
const rapidapiHost = 'community-open-weather-map.p.rapidapi.com';


// async function getWeather (city){
// 	const query = queryFirst + city;
// 	const response = await fetch(query, {
//     method: 'GET',
//     headers: {
//       'x-rapidapi-key': queryKey,
//       'x-rapidapi-host': rapidapiHost,
//     },
//   	});

//   	return response.json();

// }


// console.log(getWeather("london"));

// const london = getWeather("london");


// console.log(london.main);


// async function fillReport(cityOrCoords, reportFields) {
//   const weather = await getWeather(cityOrCoords);
//   const { current } = weather;
//   const { location } = weather;
//   const report = reportFields;

//   report.temp.textContent = `${Math.round(current.temp_c)}°C`;
//   report.wind.textContent = `${current.wind_mph} m/s, ${convertDir(current.wind_dir)}`;
//   report.cloud.textContent = `${current.cloud} %`;
//   report.press.textContent = `${current.pressure_mb} hpa`;
//   report.humidity.textContent = `${current.humidity} %`;
//   report.coords.textContent = `[ ${location.lat}, ${location.lon} ]`;
//   report.icon.src = current.condition.icon.replace(/64x64/i, '128x128');

//   if (reportFields.city !== undefined) report.city.textContent = location.name;
// // }


// fillReport('london')





 






// api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={23b165255fbf21ce4cfa7be39b155b62}