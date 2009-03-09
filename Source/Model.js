var Model = new Class({

	Implements: Events,

	set: function(key, value){
		if (!this.data) this.data = {};
		var oldValue = this.data[key];
		if (value == oldValue) return;
		// this.fireEvent('willChange', key); // TODO useful?
		this.data[key] = value;
		this.fireEvent('didChange', [key, value]);
		return this;
	},

	get: function(key){
		if (!this.data) return null;
		return this.data[key];
	},
	
	connect: function(prop, other, otherProp){
		this.addEvent('didChange', function(key, value){
			if (key == prop) other.set(otherProp, value);
		});
	}

});
