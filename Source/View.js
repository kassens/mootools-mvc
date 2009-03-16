Array.implement({ // TODO: remove for MooTools 1.3
	invoke: function(fn, args, bind){
		for (var i = 0; i < this.length; i++) this[i][fn].apply(bind, args);
		return this;
	}
});

var View = new Class({

	Implements: Events,

	initialize: function(){
		this.getters = {};
		this.setters = {};
	},

	toElement: function(){
		return this.element;
	},

	addSetter: function(name, fn){
		if (!this.setters[name]) this.setters[name] = [];
		this.setters[name].push(fn);
		return this;
	},

	setGetter: function(name, fn, noOverride){
		if (!this.getters[name] || !noOverride) this.getters[name] = fn;
		return this;
	},

	set: function(key, value){
		if (typeof key == 'object'){
			for (prop in key) this.set(prop, key[prop]);
			return this;
		}
		this.setters[key].each(function(setter){
			setter(value);
		}, this);
		return this;
	},

	get: function(key){
		return this.getters[key]();
	}

});

View.HTML = new Class({

	Extends: View,

	initialize: function(data){
		this.parent();

		var element = new Element('div', {'html': this.html}).getFirst();
		this.element = element;

		var parseMapping = function(mapping){
			mapping = mapping.split('@');
			return {
				element: mapping[0] ? element.getElement(mapping[0]) : element,
				attribute: mapping[1]
			};
		};

		var eachMapping = function(mappings, fn, bind){
			if (mappings) Hash.each(mappings, function(mappings, name){
				$splat(mappings).map(function(mapping){
					mapping = parseMapping(mapping);
					fn.call(this, name, mapping.element, mapping.attribute);
				}, this);
			}, bind);
		};

		eachMapping(this.outlets, function(name, element, attribute){
			this.addSetter(name, function(value){
				element.set(attribute, value);
			}).setGetter(name, function(){
				return element.get(attribute);
			}, true);
		}, this);

		eachMapping(this.actions, function(name, element, attribute){
			element.addEvent(attribute, (function(event){
				this.fireEvent(name, event);
			}).bind(this));
		}, this);

		if (data) this.set(data);
	}

});
