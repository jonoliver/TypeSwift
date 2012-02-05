describe("StatCounter", function(){
	
	var testName = 'QWERTY';
	var testVal = '2,1,3';

	var testData = [{
		keystrokes: 2,
		mistakes: 1,
		wpm: 3
	}];

	it('sets and retrieves score', function(){
		var counter = ts.StatCounter(true);
		counter.setScore(testName, testData);
		
		var savedVal = counter.getScore(testName);
		expect(savedVal).toEqual(testVal);
	});
	
	it('clears score', function(){
		var counter = ts.StatCounter(true);
		counter.setScore(testName, testData);
		
		var savedVal = counter.clearScore(testName);
		expect(savedVal).toEqual(undefined);
	});
});
