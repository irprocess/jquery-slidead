/*
	slideAd v0.1 (beta)

	@author s.caronia (Mind S.r.l)
	@dependencies
		* jQuery Cookie Plugin v1.3.1
		* https://github.com/carhartl/jquery-cookie

*/
(function($){
	$.fn.slideAd = function(args) {

		// settings di default
		var defaults = {
			speed: 				'slow',				// animation speed
			autoOpen:			true,				// true: opens when page opens
			autoClose:			0,					// seconds to automatic close (0 = disable);
			dismiss:			0,					// dissmiss cookie duration in days (0 = session, -1 = disable) - will need jQuery Cookie
			closers:			'.slideAd-close',	// selector for elements triggering close ad operation
			openers:			'.slideAd-open',	// selector for elements triggering open ad operation
			dismissers:			'.slideAd-dismiss',	// selector for elements triggering close and dismiss ad operation (es. destination campaign links)
			onOpen:				function(){},		// function executed after open
			onClose:			function(){}		// function executed after close
		};

		// utilities
		var utils = {
			_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			encode : function (input) {
				var output = "";var i = 0;
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;				
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);chr2 = input.charCodeAt(i++);chr3 = input.charCodeAt(i++);enc1 = chr1 >> 2;enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);	enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);enc4 = chr3 & 63;
					if (isNaN(chr2)) enc3 = enc4 = 64; else if (isNaN(chr3))enc4 = 64;
					output = output +this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
				}
				return output;
			}
		}
		
		var opts = {};
		
		var sad = this;
		
		// set css base
		sad.css('display','none');
		sad.css('position','relative');
		sad.css('height','auto');

		if (typeof(args)!="object") { // not an object (assumed as operation)
			opts=sad.data('opts');
			console.log(opts);
			if (args=='open') openAd();
			if (args=='close') closeAd();
			if (args=='dismiss') {setCookie();closeAd();}
			if (args=='reset') {deleteCookie();}
		} else if (typeof(args)=="object"){ // args is object with settings
			opts = $.extend(defaults, args);
			sad.data('opts', opts);
		} else if (!args) {
			opts=defaults;
		}

		// cookie settings
		var cookieName='_sad'+utils.encode(window.location.pathname).substring(0,10).toLowerCase()+'_'+sad.attr('id');
		var cookie=$.cookie?$.cookie(cookieName):'';
		var cookieVal=(opts.dismiss>0?"sad.d#"+opts.dismiss:"sad.s#0");
		
		// open the ad 
		if (((opts.dismiss>-1&&cookie!=cookieVal)||!opts.dismiss)&&opts.autoOpen) openAd();

		// automatic close
		if (opts.autoClose) setTimeout(function(){closeAd();},(opts.autoClose*1000));

		// binding close links
		if (opts.closers) $(opts.closers).on('click', function(e){
			e.preventDefault();
			if (opts.dismiss>-1) setCookie();
			closeAd();
		});

		// binding open links
		if (opts.openers) $(opts.openers).on('click', function(e){
			e.preventDefault();
			openAd();
		});

		// binding dismiss links
		if (opts.dismissers) $(opts.dismissers).on('click', function(e){
			e.preventDefault();
			if (opts.dismiss>-1) setCookie();
			closeAd();
			if ($(this).attr('href')!=""){
				window.open($(this).attr('href'), $(this).attr('target'));
			}
		});

		// cookie set
		function setCookie() {
			if (opts.dismiss==-1) return;
			if (opts.dismiss>0) if ($.cookie) $.cookie(cookieName, cookieVal, {expires : opts.dismiss});
			else if ($.cookie) $.cookie(cookieName, cookieVal);
		}

		// cookie delete
		function deleteCookie() {
			if ($.cookie) $.cookie(cookieName, null);
		}

		// close ad
		function closeAd() {
			sad.slideUp(opts.speed);
			if(typeof(opts.onHide)=="function") opts.onHide();
		}

		// open ad
		function openAd() {
			sad.slideDown(opts.speed);
			deleteCookie();
			if(typeof(opts.onShow)=="function") opts.onShow();
		}
		
		return sad;
	}
})(jQuery);
