Typeswift.prototype.StatCounter = function(){
	var dataProxy = new ts.LocalDataProxy();
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
		}
		return val;
	}

	function parseScores(scores){
		var hasScore = false;
		for (var val in scores){
			if (val.match(/^(QWERTY|DVORAK)$/)){
				hasScore = true;
				var score = scores[val];
				var lessons = score.split("|");
				for (var lesson = 0; lesson < lessons.length; lesson++){
					var lessonStats = lessons[lesson].split(",");
					if (lessonStats.length > 1) {
						lessons[lesson] = {
							"keystrokes" : lessonStats[0],
							"mistakes" : lessonStats[1],
							"wpm" : lessonStats[2]
						}
					}
					else { lessons[lesson] = undefined; }
				}
				scores[val] = lessons;
			}
			else delete scores[val];
		}
		return (hasScore) ? scores : null;
	}
		
	return {
		setScore : function(name, val){
			var scoreVal = createScore(val);
			dataProxy.setVal(name, scoreVal);
		},
		
		getScore : function(name){ dataProxy.getVal(name); },
		
		clearScore : function(){ dataProxy.clearVals.apply(dataProxy, arguments); },
		
		getSavedScores : function(){
			var scores = dataProxy.getData();
			return parseScores(scores);
		},
				
		populateScores : function(scores){
			log(scores);
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
				$("#scoreHeading").html(ts.resources.noScores);
			else
				$("#scoreHeading").html(ts.resources.hasScores);
			
			$("#scoreList").html("").append(output);
			$(".score").each(function(){
				$(this).find("tbody>tr:even").addClass("even");
			});
		}
	}
}
