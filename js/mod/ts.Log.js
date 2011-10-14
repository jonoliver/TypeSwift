var debug = false;
var debugPage = "#scoreScreen";
var debugLocalStorage = true;


var log = function(){};
if (window.console) {
	if (/Safari/.test(navigator.userAgent)) {
		log = function(){ console.log.apply(console, arguments) };
	}
	else if (console.debug) { log = console.debug; }
	else { log = console.log; }
}