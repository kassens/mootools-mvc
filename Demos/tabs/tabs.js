// =========
// = Views =
// =========

var TabView = new Class({

	Extends: View.HTML,

	html: '<div class="tabview"><div class="tabview-tabs"></div></div>',

	initialize: function(){
		this.parent();
		this.tabs = [];
		this.tabsElement = this.element.getElement('.tabview-tabs');
	},

	addTab: function(title, content){
		var tab = new Element('span', {text: title, 'class': 'tabview-tab'});
		this.tabs.push(tab);
		content = new Element('div', {'class': 'tabview-content'}).grab(content);
		
		if (!this.activeTab) {
			this.activeTab = tab.addClass('active');
			this.content = content.inject(this.element);
		}

		tab.addEvent('click', (function(){
			this.activeTab.removeClass('active');
			this.activeTab = tab.addClass('active');
			this.content.dispose();
			this.content = content.inject(this.element);
		}).bind(this));

		tab.inject(this.tabsElement);
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
