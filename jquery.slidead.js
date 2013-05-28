/*
	slideAd v0.5 beta 1

	@author s.caronia (Mind S.r.l)
	@dependencies
		* jQuery Cookie Plugin v1.3.1
		* https://github.com/carhartl/jquery-cookie


	ES. UTILIZZO ------------------------------------------

		// vedi defaults
		$('#testbanner').slideAd({
			autoClose:		10,
			dismiss:		2,
			autoOpen:		true,
			openers:		'#apri',
			onClose:		function(){
				alert("Closed!");
			}
		});

		------

		<div id="testbanner">
			TEST BANNER<br><br>
			<a href="" class="slideAd-close">CLOSE</a> -
			<a href="http://www.google.it" class="slideAd-dismiss" target="_blank">DONE</a>
		</div>
		<button id="apri">APRI</button>

		------

		$('#testbanner').slideAd('open');
		$('#testbanner').slideAd('close');
		$('#testbanner').slideAd('dismiss'); 	// imposta il cookie per non far riaprire l'ad e chiude
		$('#testbanner').slideAd('reset'); 		// elimina il cookie

*/


(function($){
	$.fn.slideAd = function(args) {

		// settings di default
		var defaults = {
			speed: 				'slow',					// velocità  animazione
			autoOpen:			true,					// se true si apre all'apertura della pagina
			autoClose:			0,						// secondi prima di chiusura automatica (0 = disabilita);
			dismiss:			0,						// giorni durata del cookie di dismiss (0 = sessione, -1 = disabilita) - usa un cookie per non far più visualizzare l'annuncio (necessita di plugin jQuery Cookie)
			closers:			'.slideAd-close',		// selettore degli elementi che cliccati chiudono l'ad
			openers:			'.slideAd-open',		// selettore degli elementi che cliccati aprono l'ad
			dismissers:			'.slideAd-dismiss',		// selettore dei link che cliccati dismettono l'ad (che settano il cookie prima di andare al link)
			onOpen:				function(){},			// funzione da eseguire su show
			onClose:			function(){}			// funzione da eseguire su hide
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

		if (typeof(args)!="object") { // l'argomento non è un oggetto, suppongo sia un azione
			opts=sad.data('opts');
			console.log(opts);
			if (args=='open') apri();
			if (args=='close') chiudi();
			if (args=='dismiss') {setCookie();chiudi();}
			if (args=='reset') {deleteCookie();}
		} else if (typeof(args)=="object"){ // l'argomento è un oggetto contenente i settings
			opts = $.extend(defaults, args);
			sad.data('opts', opts);
		} else if (!args) {
			opts=defaults;
		}

		// impostazioni cookie
		var cookieName='_sad'+utils.encode(window.location.pathname).substring(0,10).toLowerCase()+'_'+sad.attr('id');
		var cookie=$.cookie?$.cookie(cookieName):'';
		var cookieVal=(opts.dismiss>0?"sad.d#"+opts.dismiss:"sad.s#0");
		
		// apro il banner
		if (((opts.dismiss>-1&&cookie!=cookieVal)||!opts.dismiss)&&opts.autoOpen) apri();

		// chiusura automatica
		if (opts.autoClose) setTimeout(function(){chiudi();},(opts.autoClose*1000));

		// binding tasti close
		if (opts.closers) $(opts.closers).on('click', function(e){
			e.preventDefault();
			if (opts.dismiss>-1) setCookie();
			chiudi();
		});

		// binding tasti open
		if (opts.openers) $(opts.openers).on('click', function(e){
			e.preventDefault();
			apri();
		});

		// binding link che considerano il banner "usato"
		if (opts.dismissers) $(opts.dismissers).on('click', function(e){
			e.preventDefault();
			if (opts.dismiss>-1) setCookie();
			chiudi();
			if ($(this).attr('href')!=""){
				window.open($(this).attr('href'), $(this).attr('target'));
			}
		});

		// imposta il cookie
		function setCookie() {
			if (opts.dismiss==-1) return;
			if (opts.dismiss>0) if ($.cookie) $.cookie(cookieName, cookieVal, {expires : opts.dismiss});
			else if ($.cookie) $.cookie(cookieName, cookieVal);
		}

		// elimina il cookie
		function deleteCookie() {
			if ($.cookie) $.cookie(cookieName, null);
		}

		// chiude il banner
		function chiudi() {
			sad.slideUp(opts.speed);
			if(typeof(opts.onHide)=="function") opts.onHide();
		}

		// apre il banner
		function apri() {
			sad.slideDown(opts.speed);
			deleteCookie();
			if(typeof(opts.onShow)=="function") opts.onShow();
		}
		
		return sad;
	}
})(jQuery);