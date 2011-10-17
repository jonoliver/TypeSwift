Typeswift.prototype.Keyboard = function(){
	
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
				$("#row2 li").each(function(i){
					var $this =  $(this);
					$this.addClass("home");
					if (i == 3 || i == 6)
						$this.addClass("anchor");	
				});
				var spacer = '<li class="spacer"></li>';
				var spacebar = '<ul>' +
					spacer + spacer + spacer + spacer + spacer + spacer + 
					'<li class="spacebar 32"></li></ul>' +
					'<div class="clear"></div>';
				$("#row0").append("<li>Del</li>");
				$("#row1").prepend(spacer);
				$("#row2").prepend(spacer + spacer);
				$("#row3").prepend(spacer + spacer + spacer)
					.next().after(spacebar);55
					
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


