Typeswift.prototype.Timer = function(f){
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
};
