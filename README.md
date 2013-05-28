jquery-slidead
==============

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
$('#testbanner').slideAd('dismiss'); 	// sets cookie
$('#testbanner').slideAd('reset'); 		// deletecookie
