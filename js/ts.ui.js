(function(){
var debug = false;
var debugPage = "#scoreScreen";
var debugLocalStorage = true;
//StatCounter().clearScore("QWERTY", "DVORAK", "RANDOM");
log(document.cookie);

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
	var keyboard = new ts.Keyboard();
	var test = new ts.Test();
	var lessons = test.getLessons();
	var page = new ts.PageHandler();
	
	var $lessonid = $(".lessonId");

	// get saved scores if any
	var savedScores = ts.StatCounter().getSavedScores();
	log(savedScores);
	if (savedScores){
		test.loadScores(savedScores);
		if (!debug)
			page.goTo("#testScreen");
	}
	var keyType = ts.LocalDataProxy().getVal("KEYBOARD");

	if (debug) page.goTo(debugPage);
	
	// tiny jquery plugin for switches
	$.fn.switchButton = function(f){
		var $this = $(this);
		
		return $this.each(function(){
			var on = false;
			
			$this.click(function(){
				on = !on;
				$this.toggleClass("on", on);
				if (f) f.call(this, on);
			});
		});
	}
	
	$("#keyboardOption").switchButton(function(isOn){
		keyType = (isOn) ? "DVORAK" : "QWERTY";
		changeKeyType(keyType);
	});

	if (keyType) {
		if (keyType == "QWERTY") changeKeyType(keyType);
		else if (keyType == "DVORAK") $("#keyboardOption").click();
	}

	function changeKeyType(keyType){
		test.setKeyType(keyType);
		var lessonOptions = lessons[keyType];
		$lessonid.html(""); // clear options
		addOption($lessonid, "");
		for (var i = 0; i < lessonOptions.length; i++){
			addOption($lessonid, i, "Lesson " + (i + 1));
		}
		
		keyboard.draw(keyType);
	}
	
	$(".chooseKeyboard").click(function(){
		keyType = $(this).text();
		changeKeyType(keyType);
		page.next();
	});
	
	$("#testType").switchButton(function(isOn){
		log(isOn);
	});

 	$("#randomTest").click(function(){		
		test.randomTest();
		test.init();
		this.blur(); // spacebar will trigger button if still focused
		
	});
	
	$(".viewScores").click(function(){
		var scores = test.getScores();
		test.stop();
		ts.StatCounter().populateScores(scores);
		page.goTo("#scoreScreen");

	});
	
	$(".backToTest").click(function(){
		page.prev();
	});
	
 	$(".clearScores").click(function(){
		if (confirm("Clear all scores?")){
			var scores = test.clearScores();
			ts.StatCounter().populateScores(scores);
			page.goTo("#scoreScreen");
		}
	});
	
	$lessonid.change(function(){
		var keyboardType = test.getKeyType();
		var lesson = this.value;
		if (lesson != "") {
			test.setTest(keyboardType, lesson);
			test.init();
			this.blur();
		}
	});
	
	$("#testStage").delegate("a#nextLesson", "click", function(){
		var nextLesson = this.getAttribute("class");
		/*
		var keyboardType = test.getKeyType();
		test.setTest(keyboardType, nextLesson);
		test.start();
		*/
		$lessonid.val(nextLesson).change();
	});


	$(document).keypress(function(e){
		if (test.isInitialized()){
			e.preventDefault();
			var charCode;
			if (window.event) {charCode = window.event.keyCode;}
			else if (e) {charCode = e.which;}
			
			/*
			if (charCode == 0) { // Tab to pause
				testTimer.pause();
				test.started(false);
				$("#testStatus").html(ts.resources.paused);
			}
			*/
			
			if (keyboard.getKey(charCode)) { // if pressed key is on our keyboard
				var keyClass = "." + charCode; // keypress class for onscreen keyboard
				var charInput = String.fromCharCode(charCode); // Dvorak character from user input
				if (test.getKeyType() == "DVORAK"){ charInput = keyboard.getKey(charCode); }
				test.update(charInput, keyClass);			
			}
		}
	});

	$(document).keyup(function(e){
		test.cleanUp();
	});
	
	$(document).keyup();
		
	var HoverBoard = function(target, board){
		var isHovering = false;
		var $link = $(target);
		var $menu = $(board);
		
		$link.hover(
			
			function(){
				isHovering =  true;
				var $this = $(this);
				var pos = $this.offset();
				var linkWidth = $this.width();
				var linkHeight = $this.height();
				var menuWidth = $menu.width();
				$this.addClass("hover");
				$menu.show()
					.css({"top" : pos["top"] + linkHeight, "left": pos["left"] + ((linkWidth - menuWidth) + 1)});
			},
			function(){ 		
				isHovering = false;
				hideWindow();				
			}
		);
		$menu.hover(
			function(){
				isHovering = true;
			},
			function(){
				isHovering = false;
				hideWindow();
			}
		);
		/* need hack for ie
		$("#keyType").hover(
			function(){
				isHovering = true;
			},
			function(){
				isHovering = false;
				hideWindow();
			}
		);
		*/
		var hideIf = function(){
			if (!isHovering) {
				$link.removeClass("hover");
				$menu.hide();
			}
		};
		
		function hideWindow(){setTimeout(hideIf,100)};
	};
	var settingsHover = new HoverBoard("#settingsLink", "#settingsMenu");
	var scoresHover = new HoverBoard(".viewScores", "#scoresOver");
});

})();

