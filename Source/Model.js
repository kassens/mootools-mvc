var Model = new Class({

	Implements: Events,

	set: function(key, value){
		if (!this.data) this.data = {};
		var oldValue = this.data[key];
		if (value == oldValue) return;
		// this.fireEvent('willChange', key); // TODO useful?
		this.data[key] = value;
		this.fireEvent('change', [key, value]).fireEvent('change@' + key, [value]);
		return this;
	},

	get: function(key){
		if (!this.data) return null;
		return this.data[key];
	},
	
	connect: function(prop, other, otherProp){
		other.set(otherProp, this.get(prop));
		this.addEvent('change@' + prop, function(value){
			other.set(otherProp, value);
		});
	}

});
