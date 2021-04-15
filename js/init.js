const apikey = '23b165255fbf21ce4cfa7be39b155b62';

async function getApi (city){
	
	let dataCity = '';
	let apiCity ='';

	if (parseInt(city)) {
		apiCity = `https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apikey}&lang=ru`;				
	}
	else{
		apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru`;		
	}


	await fetch(apiCity)
	.then(function(resp) {
		if (resp.status != 200) {
			localStorage.removeItem(city);
			window.alert('Данный город не найден!');
			return null;
		}
		return resp.json();
	})
	.then((data) => {
    	dataCity = data;
  	});

  	return dataCity;
}