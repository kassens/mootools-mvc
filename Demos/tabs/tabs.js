Element.implement({
	disposeChildren: function(){
		while (this.childNodes.length) this.removeChild(this.childNodes[0]);
		return this;
	}
});

// =========
// = Views =
// =========

var TabView = new Class({

	Extends: View.HTML,

	html: '<div class="tabview"><div class="tabview-tabs"></div><div class="tabview-content"></div></div>',

	initialize: function(){
		this.parent();
		this.tabsElement = this.element.getElement('.tabview-tabs');
		this.contentElement = this.element.getElement('.tabview-content');
	},

	addTab: function(label, content){
		var select = (function(){
			if (this.activeTab) this.activeTab.removeClass('active');
			this.activeTab = tab.addClass('active');
			this.contentElement.disposeChildren().adopt(content);
		}).bind(this);

		var tab = new Element('span', {
			'text': label,
			'class': 'tabview-tab',
			'events': {'click': select}
		}).inject(this.tabsElement);

		if (!this.activeTab) select();
	}

});

// ==============
// = Controller =
// ==============

var TabViewController = new Class({

	Extends: Controller,

	initialize: function(){
		var tv = new TabView();
		var tv2 = new TabView();
		
		tv.addTab('First', tv2);
		tv.addTab('Second', new Element('div', {text: 'b'}));

		tv2.addTab('sub1', new Element('div', {text: 'a1'}));
		tv2.addTab('sub2', new Element('div', {text: 'a2'}));

		$(document.body).adopt(tv);
	}

});

window.addEvent('domready', function(){
	new TabViewController();
});
