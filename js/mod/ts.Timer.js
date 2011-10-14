var Timer = function(f){
	var timer = null;
	var tCount = 0; // timer counter
	var sTotal = 60; // Always leave as 60 (unless the earth's speed changes)
	var started = false;
	var millis = 100;
	var callback = f || updateTime();
				
	this.start = function(){
		if (!started) {
			timer = setInterval(function(){callback()}, millis);
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
		execCallback();
	}

	// set milliseconds
	this.setMillis = function(milliseconds){
		millis = milliseconds;
	}
	
	//return time in milliseconds
	this.getRawTime = function(){
		return tCount * millis;
	}
		
	function execCallback(){
		callback();
	}
	
	function updateTime(){
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
		return '%s %s"'.format(minutes, seconds);
		//$("#timerUpdater").html('%s %s"'.format(minutes, seconds));
	}
}