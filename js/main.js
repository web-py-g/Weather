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

document.querySelector('#find-me').addEventListener('click', geoFindMe);

fetch('https://api.openweathermap.org/data/2.5/weather?lat=60.0670207&lon=30.3628288&appid=23b165255fbf21ce4cfa7be39b155b62')
	.then(function(resp) {return resp.json()})
	.then(function(data){
		console.log(data);
		
		document.querySelector('.info__titel').textContent = data.name;
		document.querySelector('.temp').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
		document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
		document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
		document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
		document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;




		}
		)


// api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={23b165255fbf21ce4cfa7be39b155b62}