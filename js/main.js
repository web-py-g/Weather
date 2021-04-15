
async function defaultAdd(){

	const refreashCurrentBtn = document.querySelector('.refresh');
  	refreashCurrentBtn.onclick = () => { loadFunc(document.querySelectorAll('section')[0], ".main__city .wrapper"); };

  	const addBut = document.querySelector(".favorites__form button");
  	addBut.onclick = () => {addFavorites();};

	const defaultCity = ['москва', 'крым', 'тюмень', 'киев'];
	const defaultCityId = ['524901', '540259', '1488754', '703448'];

	if(localStorage.length == 0)
		for (let i = 0; i < defaultCity.length; i++)
			localStorage.setItem(defaultCityId[i], defaultCity[i]);


	let localArray =[];

	for(let i=0; i<localStorage.length; i++) {
	  let key = localStorage.key(i);
	  localArray.push([key, localStorage.getItem(key)]);
	}

	let weatherResponses = await Promise.all(localArray.map((item) => 
        getApi(item[0])
    ));


	for (let i = 0; i < weatherResponses.length; i++) {
		addCity(weatherResponses[i], 0);
	}
}

defaultAdd();