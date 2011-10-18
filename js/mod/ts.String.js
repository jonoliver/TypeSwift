// string resources
Typeswift.prototype.resources = {
	select: "Select a lesson!",
	start : "Start typing to begin!",
	inProgress : "Test in progress...",	
	paused : "Test paused (begin typing to resume).",
	finished : "Finished!",
	hasScores : "Your scores",
	noScores : "You don't have any saved scores yet."
};

// extend string functionality
String.prototype.format = function(){
	var ret = this.toString();
	for (var i = 0; i < arguments.length; i++) {
		ret = ret.replace("%s", arguments[i]);
	}
	return ret;
};
