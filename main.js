var customModel = (function(){

	//initial jsonModel for demonic manipulation
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

	//list of subscribers
	var subscribers = (function(){
		//get properties by getters
		var getters = Object.entries(Object.getOwnPropertyDescriptors(jsonModel))
			  .filter(([key, descriptor]) => typeof descriptor.get === 'function')
			  .map(([key]) => key);

		var subscribersList = getters.reduce((current, next) => {
			current[next] = [];
			return current;
		},{});

		return subscribersList;

	})();

	//function for add subscribe
	function addSubscribers(property, value){
		subscribers[property].push(value);
	}

	//function for get subscribers
	function getSubscribers(){
		return subscribers;
	}

	//public methods of this demonic model
	return {
		jsonModel: jsonModel,
		addSubscribers: addSubscribers,
		getSubscribers: getSubscribers
	}
})();

// cleaned flag for lulz
var wasCleaned = false;

//randomize id (just for fun)
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

// inputs create-function
function inputCreate(model, bindProperty, bindAttr){
	var input = document.createElement("input");
	var composition = compositionFunction.bind(input, model, bindProperty, bindAttr);

	input.addEventListener('keyup', function(evt){
		model.jsonModel[bindProperty] = this.value;
	});

	input.setAttribute('id', randomizeId());

	/*call first composition 
	TODO try fixed
	*/
	composition();

	//subscribe this element with model
	model.addSubscribers(bindProperty ,{
		element: input,
		composition: composition
	});

	return input;
}

// labels create-function
function labelCreate(model, bindProperty, bindAttr, inputFollow){
	var label = document.createElement("label");
	var composition = compositionFunction.bind(label, model, bindProperty, bindAttr);

	//bound label with input
	label.setAttribute('for', inputFollow);

	/*call first composition 
		TODO try fixed
	*/
	composition();

	//subscribe this element with model
	model.addSubscribers(bindProperty ,{
		element: label,
		composition: composition
	});

	return label;
}

//no comment
function compositionFunction(model, bindProperty, bindAttr){
	var _that = this;

	bindAttr.forEach(function(propertySettings){
		if(propertySettings.propType === 'attribute'){
			_that.setAttribute(propertySettings.property, model.jsonModel[bindProperty]);
			_that.value = model.jsonModel[bindProperty];
		}else if(propertySettings.propType === 'text'){
			_that.innerText = model.jsonModel[bindProperty];
		}
	});

}

// a little function for generate elements
function Element(settings){
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
	// main view container
	var myContainer = document.querySelector('.container');

	/*create new elements
		two elements:
		- input
		- label
	*/
	var kekInput = new Element({
		element: 'input',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'value', propType: 'attribute'}]
	});	

	var kekInput1 = new Element({
		element: 'input',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'value', propType: 'attribute'}]
	});

	var kekLabel = new Element({
		element: 'label',
		model: customModel,
		bindProperty: 'kekprop',
		bindAttr: [{property: 'innerText', propType: 'text'}],
		inputFollow: kekInput.getAttribute('id')
	});

	//insert elements into HTML (some bad code)
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
