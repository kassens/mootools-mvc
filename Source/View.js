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

	addOutlet: function(name, setter, getter){
		this.addSetter(name, setter);
		this.setGetter(name, getter);
		return this;
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

View.create = function(specification){
	return new Class({

		Extends: View,

		initialize: function(data){
			this.parent();

			var element = new Element('div', {html: specification.html}).getFirst();
			this.element = element;

			var parseMapping = function(mapping){
				mapping = mapping.split('@');
				return {
					element: mapping[0] ? element.getElement(mapping[0]) : element,
					attribute: mapping[1]
				};
			};

			if (specification.outlets) Hash.each(specification.outlets, function(mappings, name){
				$splat(mappings).map(function(mapping){
					mapping = parseMapping(mapping);
					this.addSetter(name, function(value){
						mapping.element.set(mapping.attribute, value);
					}).setGetter(name, function(){
						return mapping.element.get(mapping.attribute);
					}, true);
				}, this);
			}, this);

			if (specification.actions) Hash.each(specification.actions, function(mappings, action){
				$splat(mappings).map(function(mapping){
					mapping = parseMapping(mapping);
					mapping.element.addEvent(mapping.attribute, (function(event){
						this.fireEvent(action, event);
					}).bind(this));
				}, this);
			}, this);

			if (data) this.set(data);
		}

	});
};
