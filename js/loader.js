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
