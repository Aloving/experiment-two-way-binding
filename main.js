var customModel = (function(){

	var jsonModel = {
			_kekprop: '11',
			get kekprop(){
				return this._kekprop;
			},
			set kekprop(val){
				this._kekprop = val;
				getSubscribers()['kekprop'].forEach(function(subscriber){ 
					subscriber.composition();
				});
			}
		};

	var subscribers = (function(){
		var getters = Object.entries(Object.getOwnPropertyDescriptors(jsonModel))
			  .filter(([key, descriptor]) => typeof descriptor.get === 'function')
			  .map(([key]) => key);

		var subscribersList = getters.reduce((current, next) => {
			current[next] = [];
			return current;
		},{});

		return subscribersList;

	})();

	function addSubscribers(property, value){
		subscribers[property].push(value);
	}

	function getSubscribers(){
		return subscribers;
	}

	return {
		jsonModel: jsonModel,
		addSubscribers: addSubscribers,
		getSubscribers: getSubscribers
	}
})();

var wasCleaned = false;

function randomizeId(){
	var generatedID = `id-${Math.floor(Math.random() * 4000)}-${generate(5)}`;

	function generate(number){
		var text = "";
		var number = number;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    while(number--){
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
	}

	return generatedID
}

function inputCreate(model, bindProperty, bindAttr){
	var input = document.createElement("input");
	var composition = compositionFunction.bind(input, model, bindProperty, bindAttr);

	input.addEventListener('keyup', function(evt){
		model.jsonModel[bindProperty] = this.value;
	});

	input.setAttribute('id', randomizeId());
	composition();

	model.addSubscribers(bindProperty ,{
		element: input,
		composition: composition
	});

	return input;
}

function compositionFunction(model, bindProperty, bindAttr){
	var _that = this;

	bindAttr.forEach(function(propertySettings){
		if(propertySettings.propType === 'attribute'){
			_that.setAttribute(propertySettings.property, model.jsonModel[bindProperty]);
		}else if(propertySettings.propType === 'text'){
			_that.innerText = model.jsonModel[bindProperty];
		}
	});

}

function labelCreate(model, bindProperty, bindAttr, inputFollow){
	var label = document.createElement("label");
	var composition = compositionFunction.bind(label, model, bindProperty, bindAttr);

	label.setAttribute('for', inputFollow);

	composition();

	model.addSubscribers(bindProperty ,{
		element: label,
		composition: composition
	});

	return label;
}

function createElement(settings){
	var {element, model, bindProperty, bindAttr, inputFollow} = settings;
	switch(element){
		case 'input':
			return inputCreate(model, bindProperty, bindAttr);
		case 'label':
			return labelCreate(model, bindProperty, bindAttr, inputFollow);
		break;
	}
}

window.onload = function(){
	var myContainer = document.querySelector('.container');

	var kekInput = new createElement({
		element: 'input',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'value', propType: 'attribute'}]
	});	

	var kekInput1 = new createElement({
		element: 'input',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'value', propType: 'attribute'}]
	});

	var kekLabel = new createElement({
		element: 'label',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'innerText', propType: 'text'}],
		inputFollow: kekInput.getAttribute('id')
	});

	insertTo(kekInput, myContainer);
	insertTo(kekInput1, myContainer);
	insertTo(kekLabel, myContainer);
	
	function insertTo(element, domElement){
		if(!wasCleaned){
			domElement.innerHTML = '';
			wasCleaned = !wasCleaned;
		}
		domElement.appendChild(element);
	}

}
