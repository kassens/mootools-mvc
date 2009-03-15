// =========
// = Views =
// =========
var MyInputView = new Class({

	Extends: View.HTML,

	html:
		'<div class="input">' +
			'<label for="no-id">untitled</label>' +
			'<input type="text" id="no-id" value=""/>' +
		'</div>',

	outlets: {
		"id": ["label@for", "input@id"],
		"title": "label@text",
		"value": "input@value"
	},

	actions: {
		"valueChanged": ["input@change", "input@keyup"]
	}

});

var HeaderView = new Class({

	Extends: View.HTML,

	html: '<h1><span class="fahrenheit"></span>&deg; Fahrenheit equals <span class="celsius"></span>&deg; Celsius<h1>',

	outlets: {
		'c': '.celsius@text',
		'f': '.fahrenheit@text'
	}

});

// =========
// = Model =
// =========
var DegreeConverterModel = new Class({

	Extends: Model,

	set: function(key, value){
		this.parent(key, value.toInt() || 0);
	},

	initialize: function(celsius){
		this.addEvent('change', function(key, value){
			switch(key){
				case 'fahrenheit': this.set('celsius', (value - 32) * 5/9); break;
				case 'celsius': this.set('fahrenheit', (value * 9/5) + 32); break;
			}
		});
		this.set('celsius', celsius);
	}

});

// ==============
// = Controller =
// ==============

var ConverterController = new Class({

	Extends: Controller,

	initialize: function(){
		var myConverter = new DegreeConverterModel(0);

		var fInput = new MyInputView({id: 'fahrenheit', title: 'Fahrenheit'});
		fInput.addEvent('valueChanged', function(){
			myConverter.set('fahrenheit', fInput.get('value'));
		});
		myConverter.connect('fahrenheit', fInput, 'value');

		var cInput = new MyInputView({id: 'celsius', title: 'Celsius'});
		cInput.addEvent('valueChanged', function(){
			myConverter.set('celsius', cInput.get('value'));
		});
		myConverter.connect('celsius', cInput, 'value');

		var header = new HeaderView({c: "0", f: "0"});
		myConverter.connect('celsius', header, 'c');
		myConverter.connect('fahrenheit', header, 'f');

		$(document.body).adopt(header, fInput, cInput);
	}

});

window.addEvent('domready', function(){
	new ConverterController();
});
