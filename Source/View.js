var View = new Class({
	Implements: Events,
	toElement: function(){
		return this.element;
	}
});

View.create = function(specification){
	return new Class({
		Extends: View,
		initialize: function(data){
			var element = new Element('div', {html: specification.html}).getFirst();
			this.element = element;

			var parseMapping = function(mapping){
				mapping = mapping.split('@');
				return {
					element: mapping[0] ? element.getElement(mapping[0]) : element,
					attribute: mapping[1]
				};
			};

			if (specification.outlets) this.outlets = Hash.map(specification.outlets, function(mappings){
				return $splat(mappings).map(parseMapping);
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
		},
		set: function(key, value){
			if (typeof key == 'object'){
				for (prop in key) this.set(prop, key[prop]);
				return this;
			}
			this.outlets[key].each(function(outlet){
				outlet.element.set(outlet.attribute, value);
			}, this);
			return this;
		},
		get: function(key){
			var outlet = this.outlets[key][0];
			return outlet.element.get(outlet.attribute);
		}
	});
};
