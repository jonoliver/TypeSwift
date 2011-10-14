var PageHandler = function(){
	
	function setPage(){
		if ($("#testScreen").is(":visible")){
			$("#testStatusContainer").show();
		}
		else {
			$("#testStatusContainer").hide();
		}
		if ($("#scoreScreen").is(":visible")){
			$(".viewScores").parent().hide();
			$("#header .backToTest").show();			
		}
		else {
			$(".viewScores").parent().show();
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
