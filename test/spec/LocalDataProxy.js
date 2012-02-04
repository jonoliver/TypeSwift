describe("LocalDataProxy", function(){
	
	var testName = 'testname';
	var testVal = 'testval';
	var returnObj = { testname : "testval"};
	
	it('sets and retrieves value from localStorage', function(){
		var proxy = ts.LocalDataProxy(true);
		proxy.setVal(testName, testVal);
		
		var savedVal = proxy.getVal(testName);
		expect(savedVal).toEqual(testVal);
	});

	it('gets all values from localStorage', function(){
		var proxy = ts.LocalDataProxy(true);
		var data = proxy.getData(); 
		expect(data).toEqual(returnObj);
	});

	it('clears all values in localStorage', function(){
		var proxy = ts.LocalDataProxy(true);
		proxy.clearVals();
		var data = proxy.getData();
		expect(proxy.getData()).toEqual(null);
	});

	
	it('sets and retrieves value from cookie', function(){
		var proxy = ts.LocalDataProxy(false);
		proxy.setVal(testName, testVal);
		
		var savedVal = proxy.getVal(testName);
		expect(savedVal).toEqual(testVal);
	});

	it('gets all values from cookie', function(){
		var proxy = ts.LocalDataProxy(false);
		var data = proxy.getData(); 
		expect(data).toEqual(returnObj);
	});

	it('clears all values in cookie', function(){
		var proxy = ts.LocalDataProxy(false);
		proxy.clearVals();
		var data = proxy.getData();
		expect(proxy.getData()).toEqual(null);
	});

});