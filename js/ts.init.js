// create typeswift namespace where all modules will reside
var Typeswift = function(){}
var ts = new Typeswift();

//require necessary components
require([
	"js/lib/jquery-1.4.2.min.js",
	"js/mod/ts.Log.js",
	"js/mod/ts.String.js",
	"js/mod/ts.LocalDataProxy.js",
	"js/mod/ts.StatCounter.js",
	"js/mod/ts.Timer.js",
	"js/mod/ts.Test.js",
	"js/mod/ts.Keyboard.js",
	"js/mod/ts.PageHandler.js",
	"js/ts.ui.js"
]);