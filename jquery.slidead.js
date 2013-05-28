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
		var cookieName='_sad_'+sad.attr('id');
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