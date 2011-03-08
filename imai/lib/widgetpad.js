WidgetPadStorage = function(){
    var values = [];
    
    return {
	get: function(key) {
	    return values[key];
	},
		
	set: function(key, value) {
	    return values[key] = value;
	}
    };
}();

WidgetPadAccel = function(){
    return {
	update: function(func, interval) {
	    // NOOP
	},
	
	updateInterval: function(interval) {
	    // NOOP
	}
    }
}();


WidgetPad = function(){
    var initialized = false;
    var special_funcs = false;
    var _noscroll = false;

    // http://juce6ox.blogspot.com/2007/11/cssdom.html
    // by latchet
    var addCSSRule = (document.createStyleSheet)
	? (function(sheet){
	    return function(selector, declaration){
		sheet.addRule(selector, declaration);
	    };
	})(document.createStyleSheet())
    : (function(sheet){
	return function(selector, declaration){
	    sheet.insertRule(selector + '{' + declaration + '}', sheet.cssRules.length);
	};
    })((function(e){
	e.appendChild(document.createTextNode(''));
	(document.getElementsByTagName('head')[0] || (function(h){
	    document.documentElement.insertBefore(h, this.firstChild);
	    return h;
	})(document.createElement('head'))).appendChild(e);
	return e.sheet;
    })(document.createElement('style')));
    
    var overlay_div;
    var overlay_text_div;
    var create_overlay_div = function() {
	if(overlay_div) return;

	overlay_div = document.createElement('div');
	overlay_div.style.width = "100%";
	overlay_div.style.height = "100%";
	overlay_div.style.position = "fixed";
	overlay_div.style.left = "0";
	overlay_div.style.top = "0";
	overlay_div.style.background = "black";
	overlay_div.style.opacity = "0.6";
	overlay_div.style.zIndex = "65535";
	document.body.appendChild(overlay_div);

	overlay_text_div = document.createElement('div');
	overlay_text_div.style.width = "100%";
	overlay_text_div.style.height = "100%";
	overlay_text_div.style.position = "fixed";
	overlay_text_div.style.left = "0";
	overlay_text_div.style.top = "0";
	overlay_text_div.style.color = "white";
	overlay_text_div.style.zIndex = "65536";
	overlay_text_div.style.fontSize = "20px";
	overlay_text_div.style.textAlign = "center";
	overlay_text_div.style.textShadow = "black 5px 5px 5px";

	overlay_text_div.style.lineHeight = "416px";

	overlay_text_div.innerHTML = "This widget required iPhone app";
	document.body.appendChild(overlay_text_div);
	
	var hide_msg = function() {
	    overlay_div.style.display = 'none';
	    overlay_text_div.style.display = 'none';
	};
	overlay_text_div.addEventListener("touchend", hide_msg, false);
	overlay_text_div.addEventListener("click", hide_msg, false);
	
	return overlay_div;
    };
    
    return {
	storage: WidgetPadStorage,
	accelerometer: WidgetPadAccel,
	version: 1.0,
	
	addEventListener: function(event, func) {
	    if(window.addEventListener) {
		window.addEventListener(event, func, false);
	    }
	    else {
		window.attachEvent(event, func);
	    }
	},

	ready: function(func) {
	    this.addEventListener("load", func, false);
	},
	
	init: function() {
	    if(!initialized) {
		try {
		    document.body.addEventListener("touchmove", function(event) {
			if(_noscroll) event.preventDefault();
		    }, false);
		    document.documentElement.style.webkitUserSelect = 'none'; 
		    document.documentElement.style.webkitTouchCallout = 'none';
		    document.documentElement.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
		    setTimeout(function(){
			window.scrollTo(0,1);
			window.scrollTo(0,0);
		    },100);
		}
		catch(e) {}
		initialized = true;
		addCSSRule("html, body", "margin: 0; padding: 0; ")
		if(parent && parent.opener) {
		    parent.opener.$("#toolbar-preview-browser").removeClass("loading-icon");
		}
	    }
	},

	noscroll: function(flg) {
	    if(parent && parent.scrollEmulation) {
		parent.noscroll(flg);
	    }

	    _noscroll = flg;
	},
	
	log: function(str) {
	    try {
		if(parent && parent.opener && parent.opener.logger) {
		    parent.opener.logger.info(str);
		}
	    }
	    catch(e) {
		// NOOP
	    }
	},
	
	error: function(str) {
	    try {
		if(parent && parent.opener && parent.opener.logger) {
		    parent.opener.logger.error(str);
		}
	    }
	    catch(e) {
		// NOOP
	    }
	},
		
	sound: function(str) {
	    // NOOP
	},
		
	message: function(title, msg, callback) {
		create_overlay_div();
	    alert(title+"\n"+msg);
	    setTimeout(callback, 0);
	},
		
	confirm: function(title, msg, callback) {
	    var ok = confirm(title+"\n"+msg);
	    setTimeout(function(){callback(ok);}, 0);
	},
		
	prompt: function(title, callback) {
	    var ok = prompt(title);
	    setTimeout(function(){callback(ok);}, 0);
	},
	
	get: function(options) {
	    if(!special_funcs) {
		create_overlay_div();
		special_funcs = true;
	    }
	},
		
	post: function(options) {
	    if(!special_funcs) {
		create_overlay_div();
		special_funcs = true;
	    }
	}
    };
}();

WidgetPad.addEventListener("load", function(){WidgetPad.init();});
