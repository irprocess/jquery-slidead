jquery-slidead
==============

###Options:

* speed - animation spped (fast,slow,number)
* autoOpen - true opens when page opens (true | false)
* autoClose - seconds to automatic close (0 = disable);
* dismiss - dissmiss cookie duration in days (0 = session, -1 = disable) - will need jQuery Cookie
* closers - selector for elements triggering close ad operation
* openers - selector for elements triggering open ad operation
* dismissers - selector for elements triggering close and dismiss ad operation (es. destination campaign links)
* onOpen - function executed after open
* onClose - function executed after close

###Example js:
```javascript
$(function(){
	$('#testbanner').slideAd({
		autoClose:		10,
		dismiss:		2,
		autoOpen:		true,
		openers:		'#apri',
		onClose:		function(){
			alert("Closed!");
		}
	});
	
	$('#testbanner').slideAd('open');
	$('#testbanner').slideAd('close');
	$('#testbanner').slideAd('dismiss'); // sets cookie
	$('#testbanner').slideAd('reset'); // deletecookie
});
```
###Example html:
```html
<div id="testbanner">
	TEST BANNER<br><br>
	<a href="" class="slideAd-close">CLOSE</a> -
	<a href="http://www.google.it" class="slideAd-dismiss" target="_blank">DONE</a>
</div>
<button id="apri">APRI</button>
```
