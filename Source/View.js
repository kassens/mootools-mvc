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
			this.element = new Element('div', {html: specification.html}).getFirst();
			if (specification.outlets) this.outlets = Hash.map(specification.outlets, function(mappings){
				return $splat(mappings).map(function(mapping){
					mapping = mapping.split('@');
					return {
						element: this.element.getElement(mapping[0]),
						attribute: mapping[1]
					};
				}, this);
			}, this);
			if (specification.actions) Hash.each(specification.actions, function(mappings, action){
				$splat(mappings).map(function(mapping){
					mapping = mapping.split('@');
					this.element.getElement(mapping[0]).addEvent(mapping[1], (function(event){
						this.fireEvent(action, event);
					}).bind(this));
				}, this);
			}, this);
			this.set(data);
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
