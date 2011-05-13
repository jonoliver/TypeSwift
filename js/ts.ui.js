(function(){

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

// string resources
var resources = {
	select: "Please select a test",
	start : "Start typing to begin!",
	inProgress : "Test in progress...",	
	paused : "Test paused (begin typing to resume).",
	finished : "Finished!",
	hasScores : "Your scores",
	noScores : "You don't have any saved scores yet."
}

String.prototype.format = function(){
	var ret = this.toString();
	for (var i = 0; i < arguments.length; i++) {
		ret = ret.replace("%s", arguments[i]);
	}
	return ret;
}

var StatCounter = function(){
	
	var returnObj = {};
		
	function createScore(val){
		if (typeof val != "undefined" ){
			if (typeof val == "object") {
				var output = [];
				for (var i = 0; i < val.length; i++){
					if (typeof val[i] != "undefined") {
						output[i] = [
							val[i].keystrokes,
							val[i].mistakes,
							val[i].wpm
						];
					}
				}
				return output.join("|");
			}
			else {
				return val;
			}
		}
	}

	function parseScores(val){
		var lessons = val.split("|");
		for (var lesson = 0; lesson < lessons.length; lesson++){
			var lessonStats = lessons[lesson].split(",");
			if (lessonStats.length > 1) {
				lessons[lesson] = {
					"keystrokes" : lessonStats[0],
					"mistakes" : lessonStats[1],
					"wpm" : lessonStats[2]
				}
			}
			else {
				lessons[lesson] = undefined;
			}
		}
		return lessons;
	}
		
	function hasLocalStorage() {
		try { return 'localStorage' in window && window['localStorage'] !== null; }
		catch (e) { return false; }
	}

	if(hasLocalStorage){
		returnObj = {
			setScore : function(name, val){
				var scoreVal = createScore(val);
				window.localStorage[name] = scoreVal;
				log(window.localStorage[name]);
			},
			getScore : function(name){
				return window.localStorage[name];
			},
			clearScore : function(){
				for (var i = 0; i < arguments.length; i++){
					window.localStorage.removeItem(arguments[i]);
				}
			},
			getSavedScores : function(){
				log(localStorage.length);
				if (localStorage.length > 0){
					var cookieObj = {};
					for (var i = 0; i < localStorage.length; i++){
						var lesson = localStorage.key(i);
						cookieObj[lesson] = parseScores(localStorage[lesson]);
					}
					return cookieObj;
				}
				else return undefined;
			}
		}
	}
	else {
		function readCookieVal(name){
			var cookieObj = {};
			var cookies = document.cookie.split(/;\s*/);
			for (i = 0; i < cookies.length; i++){
				var cookie = cookies[i].split("=");
				var lessons = parseScores(cookie[1]);
				cookieObj[cookie[0]] = lessons;
			}
			if (name) {
				return cookieObj[name];
			}
			return cookieObj;
		}
		
		function setCookie(name, val, duration){
			var expires = "";
			if (duration){
				var date = new Date();
				date.setDate(date.getDate() + duration);
				expires = " expires=%s;".format(
					(duration == -1) ? "Thu, 01-Jan-1970 00:00:01 GMT" : date.toGMTString()
				);
			}
			var cookie = "%s=%s;%s".format(name, val, expires);
			document.cookie = cookie;
		}
		
		returnObj = {
			setScore : function(name, val, duration){
				var scoreVal = createScore(val);
				setCookie(name, scoreVal, duration || 365);
				log("cookie: ", document.cookie);
			},
			getScore : function(name){
				return readCookieVal(name);
			},
			clearScore : function(){
				for (var i = 0; i < arguments.length; i++){
					setCookie(arguments[i], "", -1);
				}
			},
			getSavedScores : function(){
				if (document.cookie) {
					return readCookieVal();
				}
				return null;
			}
		}
	}
	
	//common functions
	returnObj.populateScores = function(scores){
		var output = "";
		var heading = "";
		for (var lesson in scores){
			if (scores[lesson].length > 0) {
				var ksTotal = 0;
				var mTotal = 0;
				var wpmTotal = 0;
				var wpmCount = 0;
				var aCount = 0;
				var aTotal = 0;
				
				output += "<table class='score' cellspacing=0>";
				output += "<thead>";
				output += "<tr class='emphasis'><th>%s</th><th>K</th><th>M</th><th>W</th><th>A</th></tr>".format(lesson);
				output += "</thead>";
				
				var lessons = scores[lesson];
				for (var i = 0; i <= lessons.length; i++){
					if (lessons[i]) {
						var keystrokes = lessons[i]["keystrokes"];
						var mistakes = lessons[i]["mistakes"];
						var wpm = lessons[i]["wpm"];
						var accuracy = Math.round(100-(mistakes/keystrokes*100));
						ksTotal += parseInt(keystrokes);
						mTotal += parseInt(mistakes);
						wpmTotal += parseInt(wpm);
						wpmCount++;
						aTotal += accuracy;
						aCount++;
						output += "<tr>";
						output += "<td class='lesson'>Lesson %s</td>".format(i + 1);
						output += "<td class='lessonDetail'>%s</td>".format(keystrokes);
						output += "<td class='lessonDetail'>%s</td>".format(mistakes);
						output += "<td class='lessonDetail'>%s</td>".format(wpm);
						output += "<td class='lessonDetail'>%s%</td>".format(accuracy);
						output += "</tr>";
					}
				}
				output += "<tr class='emphasis'>";
				output += "<td class='lesson'>Total</td>";
				output += "<td class='lessonDetail'>%s</td>".format(ksTotal);
				output += "<td class='lessonDetail'>%s</td>".format(mTotal);
				output += "<td class='lessonDetail'>%s</td>".format(Math.round(wpmTotal/wpmCount));
				output += "<td class='lessonDetail'>%s%</td>".format(Math.round(aTotal/aCount));
				output += "</tr>";
				output += "<table>";
			}
		}
		
		if (output == "")
			$("#scoreHeading").html(resources.noScores);
		else
			$("#scoreHeading").html(resources.hasScores);
		
		$("#scoreList").html("").append(output);
		$(".score").each(function(){
			$(this).find("tbody>tr:even").addClass("even");
		});
	}

			
	return returnObj;
}
//StatCounter().clearScore("QWERTY", "DVORAK", "RANDOM");
log(document.cookie);

var Timer = function(f){
	var timer = null;
	var tCount = 0; // timer counter
	var sTotal = 60; // Always leave as 60 (unless the earth's speed changes)
	var started = false;
	var timerResultContainer = "#timerUpdater";
	var millis = 100;
	var callback = f || defaultCallback;
				
	this.start = function(){
		if (!started) {
			timer = setInterval(function(){updateTime(callback)}, millis);
			started = true;
		}
	}

	this.pause = function(){
		if (started) {
			clearInterval(timer);
			started = false;
		}
	}
	
	this.reset = function(){
		tCount = 0;
	}
						
	// set result container
	this.setContainer = function(container){
		timerResultContainer = container;
	}

	// set milliseconds
	this.setMillis = function(milliseconds){
		millis = milliseconds;
	}
	
	//return time in milliseconds
	this.getRawTime = function(){
		return tCount * millis;
	}
	
	// public method to set timer results 
	this.setTimerResults = function(){
		updateTime(callback);
	}
	
	function updateTime(callback){
		callback();
	}
	
	function defaultCallback(){
		var seconds = tCount/10;
		var minutes = 0;
		if (seconds > sTotal) {
			minutes = Math.floor(seconds / sTotal);
			seconds = Math.floor((seconds % sTotal)*10)/10;
		}
		if (minutes == 0) { minutes = ""; }
		else minutes += "'";
		if (seconds == Math.round(seconds)) seconds += ".0";
		tCount++;
		$(timerResultContainer).html('%s %s"'.format(minutes, seconds));
	}
}
var Test = function(){
	var testTimer = new Timer();
	var stats = new StatCounter()
	
	var testStarted = false;
	var testEnded = false;
	var timerStarted = false;
	var sCount = 0; // index of string to match against
	var kCount = 0; // keystroke count
	var mCount = 0; // mistake count
	var wCount = 0; // total words
	var wpm = 0;
	var keyboardType = ""; // qwerty or dvorak
	var testType = ""; // for scores
	var testString = ""; // string to match
	var curLesson = 0;
	var lessonIndex = 0;

	var lessons = {
		"QWERTY" : [
			[ // test
				"aaa",
				"sss",
				"ddd"
			],
			[ // lesson 1
				"fff jjj fff jjj",
				"uuu hhh uuu hhh" /*,
				"uh uh uh uh",
				"hu hu hu hu",
				"huh huh huh huh",
				"uh huh uh huh uh huh uh huh",
				"h u uh hu uhh huh uhh",
				"h u uh hu uhh huh uhh" */
			],
			[ // lesson 2
				"eeee tttt eeee tttt",
				"eeee tttt eeee tttt",
				"et et et et",
				"tee tee tee tee",
				"tete tete tete tete",
				"eet eet eet eet",
				"t e et te teet tee teet tete et",
				"t e et te teet tee teet tete et"
			]
		],
		"DVORAK" : [
			[ // test
				"aaa",
				"ooo"
			],
			[ // test
				"aaa",
				"ooo",
				"eee"
			],
			[ // lesson 1
				"uuu hhh uuu hhh",
				"uuu hhh uuu hhh",
				"uh uh uh uh",
				"hu hu hu hu",
				"huh huh huh huh",
				"uh huh uh huh uh huh uh huh",
				"h u uh hu uhh huh uhh",
				"h u uh hu uhh huh uhh"
			],
			[ // lesson 2
				"eeee tttt eeee tttt",
				"eeee tttt eeee tttt",
				"et et et et",
				"tee tee tee tee",
				"tete tete tete tete",
				"eet eet eet eet",
				"t e et te teet tee teet tete et",
				"t e et te teet tee teet tete et"
			]
		]
	}

	var randomQuotes = ["Are you an American Gangster?", "Back off man, I'm a scientist.", "I love the smell of napalm in the morning.", "Your mother ate my dog!"];
	var dumpQuotes = [];

	var scores = {};

	function clearTheScores(){
		scores = {
			"QWERTY" : [],
			"DVORAK" : [],
			"RANDOM" : []
		};	
		StatCounter().clearScore("QWERTY", "DVORAK", "RANDOM");
		return scores;
	}

	function updateScores() {
		wpm = calculateWPM(testTimer.getRawTime());
		if (typeof scores[testType] == "undefined"){
			scores[testType] = [];
			log("scores",scores[testType]);
		}
		scores[testType][curLesson] = {
			"keystrokes" : kCount,
			"mistakes" : mCount,
			"wpm" : wpm
		};
		log(scores);
		stats.setScore(testType, scores[testType]);
		log(localStorage.length);
	}
	
	function getRandomTest(){
		testType = "RANDOM";
		if (randomQuotes.length < 1) {
			randomQuotes = dumpQuotes;
			dumpQuotes = [];
		}
		var testNum = Math.floor(Math.random()* randomQuotes.length);
		var quote = randomQuotes.splice([testNum],1);
		dumpQuotes.push(quote[0]);
		return quote[0];
	}
	
	function updateTestResults(){
		$("#keystrokeUpdater").html(kCount);
		$("#mistakeUpdater").html(mCount);			
		var accuracy = (kCount) ? Math.round(100-(mCount/kCount*100)) + "%" : "~";
		$("#accuracyUpdater").html(accuracy);
		wpm = (testEnded) ? calculateWPM(testTimer.getRawTime()) : "~";
		$("#wpmUpdater").html(wpm);
	}
		
	function updateTestString(){
		var first = testString.substring(0, sCount);
		var curChar = testString.charAt(sCount);
		var last = testString.substring(sCount + 1, testString.length);
		var fullString = '<span class="testString">%s<span class="curChar">%s</span><span class="charRemainder">%s</span></span>';
		fullString = fullString.format(first, curChar, last);
		$("#testString,#resultString").html(fullString);
	}

	function updateTestStage(){
		if (lessonIndex != null){
			var thisLesson = lessons[keyboardType][curLesson];
			var $testStage = $("#testStage");
			if (lessonIndex == 0) {
				var markers = [];
				for (i = 0; i < thisLesson.length; i++) {
					markers[i] = "<span>&#149</span>"; // add bullets
				}
				$testStage.html(markers.join("&nbsp;"));
			}
			else if(lessonIndex == thisLesson.length) {
				var totalLessons = lessons[keyboardType].length - 1;
				$testStage.html('<span class="curLesson">&#10003</span>');
				/*
				if (curLesson > 0) {
					$testStage.prepend('<a id="prevLesson" class="%s">&#171 Last Lesson </a>'.format(curLesson - 1));
				}
				*/
				if (curLesson < totalLessons) {
					$testStage.append(' <a id="nextLesson" class="%s">Next Lesson &#187</a>'.format(parseInt(curLesson) + 1));
				}
			}
			$testStage.children("span").removeClass("curLesson")
				.eq(lessonIndex).addClass("curLesson");
		}
	}
	
	function endTest(){
		$("#testString").add("#resultString").add(".result").addClass("finished");
	}
	
	function calculateWPM(rawTime){
		var wAmt = wCount;
		wAmt = Math.round(wAmt/rawTime*100000);
		wAmt = Math.round(60*wAmt/100);
		return wAmt;
	}

	function resetTestTimer(){
		testTimer.pause();
		testTimer.reset();
		testTimer.setTimerResults();

	}
	return {
		started : function(setBool){
			//if(setBool != null) {
				//testStarted = setBool;
			//}
			return testStarted;
		},
		start : function(){
			if($("#testScreen").is(":visible"))
			{
				testStarted = true;
				this.reset();
			}
		},
		
		stop : function(){
			
		},
		
		reset : function(resetMsg){
				testEnded = false;
				timerStarted = false;
				sCount = 0; 
				kCount = 0;
				mCount = 0;
				wCount = 0;			
				keyboardType = $("#keyType").val();
				resetTestTimer();
				updateTestString();
				updateTestStage();
				updateTestResults();
				$("#testStatus").html(resetMsg || resources.start);
				$("#testString").add("#resultString").add(".result").removeClass("finished");
				$("#accuracyLabel").add("#wpmLabel").addClass("disabled");
		},
		
		update : function(charInput, keyClass){
			var response = false;
			if (!timerStarted) {
				timerStarted = true;
				$("#testStatus").html(resources.inProgress);
				testTimer.start();
			}
			if (!testEnded) {
				kCount++;
				
				if (kCount > 0) {
					$("#accuracyLabel").removeClass("disabled");
				}
				
				if (charInput == testString.charAt(sCount)) { // correct key
					$(keyClass).add(".curChar").addClass("rightKey");
					sCount++;
					updateTestString();
					response = true;
				}
				else { // wrong key
					$(keyClass).add(".curChar").addClass("wrongKey");
					mCount++;
					cursor.pause();
				}
				if (testString.length == sCount) { // successful finish
					wCount += testString.split(" ").length;
					var lesson = lessons[keyboardType][curLesson];
					if (lessonIndex != null && lessonIndex < lesson.length - 1){
						sCount = 0;
						lessonIndex++;
						
						testString = lesson[lessonIndex];
						updateTestString();
					}
					else {
						lessonIndex++;
						testTimer.pause();
						endTest();
						$("#testStatus").html(resources.finished);
						$("#wpmLabel").removeClass("disabled");
						testStarted = false;
						testEnded = true;
						updateScores();
					}
					updateTestStage();

				}
				updateTestResults();
			}
			return response;
		},
		
		cleanUp : function(){
			$(".rightKey").add(".curChar").removeClass("rightKey");
			$(".wrongKey").add(".curChar").removeClass("wrongKey");
			$(".curChar").addClass("cursorBlink");
			cursor.start();
		},
		
		randomTest : function(){
			testString = getRandomTest();
			lessonIndex = null;
		},
		
		setTest : function(keyboard, lesson){
			keyboardType = keyboard;
			testType = keyboardType;
			curLesson = lesson;
			lessonIndex = 0;
			testString = lessons[keyboard][lesson][0];
		},
		
		getLessons : function(){
			return lessons;
		},
		
		getScores : function(){
			return scores;
		},
		
		loadScores : function(scoreObj){
			scores = scoreObj;
			log(scores);
		},
		clearScores : function(){
			clearTheScores();
		}
	}
}

var Keyboard = function(){
	
		var keyGuideArray = [
			// row1 secondary
			["49", "1"],["50", "2"],["51", "3"],["52", "4"],["53", "5"],["54", "6"],["55", "7"],["56", "8"],["57", "9"],["48", "0"],["45", "["],
			// row1 main
			["61", "]"],["33", "!"],["64", "@"],["35", "#"],["36", "$"],["37", "%"],["94", "^"],["38", "&"],["42", "*"],["40", "("],["41", ")"],["95", "{"],["43", "}"],
			// row2 secondary
			["113", "'"],["119", ","],["101", "."],["114", "p"],["116", "y"],["121", "f"],["117", "g"],["105", "c"],["111", "r"],["112", "l"],["91", "/"],["93", "="],
			// row2 main
			["81", '"'],["87", "<"],["69", ">"],["82", "P"],["84", "Y"],["89", "F"],["85", "G"],["73", "C"],["79", "R"],["80", "L"],["123", "?"],["125", "+"],
			// row3 secondary
			["97", "a"],["115", "o"],["100", "e"],["102", "u"],["103", "i"],["104", "d"],["106", "h"],["107", "t"],["108", "n"],["59", "s"],["39", "-"],
			// row3 main
			["65", "A"],["83", "O"],["68", "E"],["70", "U"],["71", "I"],["72", "D"],["74", "H"],["75", "T"],["76", "N"],["58", "S"],["34", "_"],
			// row4 secondary
			["122", ";"],["120", "q"],["99", "j"],["118", "k"],["98", "x"],["110", "b"],["109", "m"],["44", "w"],["46", "v"],["47", "z"],
			// row4 main
			["90", ":"],["88", "Q"],["67", "J"],["86", "K"],["66", "X"],["78", "B"],["77", "M"],["60", "W"],["62", "V"],["63", "Z"],
			// space
			["32", " "]
		];
		
		// this is separate from KeyGuideArray because Chrome does weird "for in" loops
		var keyGuide = getKeyGuide();
		
		function getKeyGuide(){
			var keyGuide = {};
			for (var i = 0; i < keyGuideArray.length; i++) {
				var val = keyGuideArray[i][1];
				keyGuide[keyGuideArray[i][0]] = val;
			}
			return keyGuide;
		}
		
		var shareKeys = {
			"33" : "49",
			"64" : "50",
			"35" : "51",
			"36" : "52",
			"37" : "53",
			"94" : "54",
			"38" : "55",
			"42" : "56",
			"40" : "57",
			"41" : "48",
			"95" : "45",
			"43" : "61",
			"123" : "91",
			"125" : "93",
			"58" : "59",
			"34" : "39",
			"60" : "44",
			"62" : "46",
			"63" : "47"
		}
		
		this.draw = function(keyType){
			var keyRowIds = [];
			var keyRows = getKeyRows();
			function getKeyRows(){
				var keyRows = {};
				for (var i = 0; i <= 3; i++){
					var row = keyRows["row" + i] = {};
					row["main"]= [];
					row["secondary"]= [];
				}
				for (var k = 0; k < keyGuideArray.length; k++) {
					if (k >=  0 && k < 12) { keyRows.row0.secondary.push(keyGuideArray[k][0]); }
					if (k >= 12 && k < 24) { keyRows.row0.main.push( keyGuideArray[k][0] ); }
					if (k >= 24 && k < 36) { keyRows.row1.secondary.push( keyGuideArray[k][0] ); }
					if (k >= 36 && k < 48) { keyRows.row1.main.push( keyGuideArray[k][0] ); }
					if (k >= 48 && k < 59) { keyRows.row2.secondary.push( keyGuideArray[k][0] ); }
					if (k >= 59 && k < 70) { keyRows.row2.main.push( keyGuideArray[k][0] ); }
					if (k >= 70 && k < 80) { keyRows.row3.secondary.push( keyGuideArray[k][0] ); }
					if (k >= 80 && k < 90) { keyRows.row3.main.push( keyGuideArray[k][0] ); }
				}
				return keyRows;
			}
		
			function createKeyRow(row){
				var oRow = keyRows[row];
				var ul = $("<ul></ul>")
					.attr("id", row)
					.appendTo("#keyboard");
				for (var i = 0, len = oRow.secondary.length; i <len; i++ ) {
					var mainCode = oRow.secondary[i];
					var secondCode = oRow.main[i];
					var dSecondCode = secondCode // for comparison (changes below if DVORAK layout)
					var mainChar = String.fromCharCode(mainCode);
					var secondChar = String.fromCharCode(secondCode);
					if (keyType == "DVORAK"){
						mainChar = keyGuide[mainCode];
						secondChar = keyGuide[secondCode];
						dSecondCode = secondChar.charCodeAt(0).toString();
					}
					var li = $("<li></li>")
						.addClass(mainCode)
						.addClass(secondCode)
						.appendTo(ul);
					for (var key in shareKeys) {
						if (key == dSecondCode) {
							$("<span></span>")
								.addClass("secondary")
								.text(secondChar)
								.appendTo("." + mainCode)
								.after("&nbsp;&nbsp;");
						}
					}
					var mainspan = $("<span></span>")
						.addClass("main")
						.text(mainChar.toUpperCase())
						.appendTo(li);
				}
				ul.after('<div class="clear"></div>');
			}
		
			// add spacebars and spacers for layout (pretty dirty)
			function addExtras(){
				var spacer = '<li class="spacer"></li>';
				var spacebar = '<ul>' +
					spacer + spacer + spacer + spacer + spacer + spacer + 
					'<li class="spacebar 32"></li></ul>' +
					'<div class="clear"></div>';
				$("#row0").append("<li>Del</li>");
				$("#row1").prepend(spacer);
				$("#row2").prepend(spacer + spacer);
				$("#row3").prepend(spacer + spacer + spacer)
					.next().after(spacebar)
			}
			
			$("#keyboard").html("");
			createKeyRow("row0");
			createKeyRow("row1");
			createKeyRow("row2");
			createKeyRow("row3");
			addExtras();
		}
				
		this.getKey = function(charCode){
			return keyGuide[charCode];		
		}
}


var PageHandler = function(){
	
	function setPage(){
		if ($("#testScreen").is(":visible")){
			$("#testStatusContainer").show();
		}
		else {
			$("#testStatusContainer").hide();
		}
		if ($("#scoreScreen").is(":visible")){
			$(".viewScores").hide();
			$("#header .backToTest").show();			
		}
		else {
			$(".viewScores").show();
			$("#header .backToTest").hide();			
		}
		
	}
	
	return {
		"next" : function(){
			$(".page:visible").hide().next().fadeIn("fast");
			setPage();
		},
		"prev" : function(){
			$(".page:visible").hide().prev().fadeIn("fast");
			setPage();
		},
		"goTo" : function(page){
			$(".page:visible").hide();
			$(page).fadeIn("fast");
			setPage();
		}
	}
}

var cursor = new Timer(function(){
	$("#cursor").toggle();
	$(".curChar").toggleClass("cursorBlink");
});
cursor.setMillis(400);
cursor.start();

function generateKeyObj(){ 
	var qwerty = " -=qwertyuiop[]asdfghjkl;'zxcvbnm,./_+QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?";
	var dvorak = " []',.pyfgcrl/=aoeuidhtns-;qjkxbmwvz{}\"<>PYFGCRL?+AOEUIDHTNS_:QJKXBMWVZ";
	for (i = 0; i < qwerty.length; i++){
			var curQ = qwerty[i];
			var curD  = dvorak.charAt(i);
			var curCC = qwerty.charCodeAt(i);
			$("body").prepend('"' + curCC + '" : "' + curD + '",<br>');
	}
}


function addOption(field, value, label) {
	label = label || value;
	field.append("<option value='" + value + "'>" + label + "</option>");
}

function addOptions(field, options) {
	$(options).each(function(){
		field.append("<option value='" + this + "'>" + this + "</option>");
	});
}




$(document).ready(function() {
	var keyboard = new Keyboard();
	var test = new Test();
	var lessons = test.getLessons();
	var page = new PageHandler();

	var $keytype = $("#keyType");
	var $lessonid = $("#lessonId");

	// get saved scores if any
	var savedScores = StatCounter().getSavedScores();
	log(savedScores);
	if (savedScores){
		test.loadScores(savedScores);
		if (!debug)
			page.goTo("#testScreen");
	}
	if (debug)
		page.goTo(debugPage);
	
	for (var keyTypeOption in lessons) {
		var curType = lessons[keyTypeOption];
		addOption($keytype, keyTypeOption);
	}
	
	$keytype.change(function(){
		var keyType = this.value;

		// add lesson options
		var lessonOptions = lessons[keyType];
		$lessonid.html(""); // clear options
		addOption($lessonid, "");
		for (var i = 0; i < lessonOptions.length; i++){
			addOption($lessonid, i, "Lesson " + (i + 1));
		}
		
		keyboard.draw(keyType);
	});
	$keytype.change();

	
 	$("#randomTest").click(function(){		
		test.randomTest();
		test.start();
		this.blur(); // spacebar will trigger button if still focused
		
	});

	$(".chooseKeyboard").click(function(){
		$keytype.val($(this).text());
		$keytype.change();
		page.next();
	});
	
	$(".viewScores").click(function(){
		var scores = test.getScores();
		test.reset();
		StatCounter().populateScores(scores);
		page.goTo("#scoreScreen");

	});
	
	$(".backToTest").click(function(){
		page.prev();
	});
	
 	$(".clearScores").click(function(){
		if (confirm("Clear all scores?")){
			test.clearScores();
			$(".viewScores").click();
		}
	});
	
	$lessonid.change(function(){
		var keyboardType = $keytype.val();
		var lesson = this.value;
		if (lesson != "") {
			test.setTest(keyboardType, lesson);
			test.start();
			this.blur();
		}
	});
	
	$("#testStage").delegate("a#nextLesson", "click", function(){
		var nextLesson = this.getAttribute("class");
		/*
		var keyboardType = $keytype.val();
		test.setTest(keyboardType, nextLesson);
		test.start();
		*/
		$lessonid.val(nextLesson).change();
	});


	$(document).keypress(function(e){
		if (test.started()){
			e.preventDefault();
			var charCode;
			if (window.event) {charCode = window.event.keyCode;}
			else if (e) {charCode = e.which;}
			
			/*
			if (charCode == 0) { // Tab to pause
				testTimer.pause();
				test.started(false);
				$("#testStatus").html(resources.paused);
			}
			*/
			
			if (keyboard.getKey(charCode)) { // if pressed key is on our keyboard
				var keyClass = "." + charCode; // keypress class for onscreen keyboard
				var charInput = String.fromCharCode(charCode); // Dvorak character from user input
				if ($keytype[0].value == "DVORAK"){ charInput = keyboard.getKey(charCode); }
				test.update(charInput, keyClass);			
			}
		}
	});

	$(document).keyup(function(e){
		test.cleanUp();
	});
	
	$(document).keyup();
		
});

})();

