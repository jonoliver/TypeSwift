Typeswift.prototype.LocalDataProxy = function(setStorageMode){
	function hasLocalStorage() {
		// for debugging and tests, true for localStorage, false for cookie
		if (setStorageMode !== undefined){
			return setStorageMode;
		}
		
		try { return 'localStorage' in window && window['localStorage'] !== null; }
		catch (e) { return false; }
	}

	if(hasLocalStorage()){
		return {
			setVal : function(name, val){
				window.localStorage[name] = val;
			},
			getVal : function(name){ return window.localStorage[name]; },
			
			clearVals : function(){
				if (arguments.length == 0) {
					for (var i = window.localStorage.length - 1; i >= 0; i--){
						window.localStorage.clear();
					}
				}
				else {
					for (var i = 0; i < arguments.length; i++){
						window.localStorage.removeItem(arguments[i]);
					}
				}
			},
			getData : function(){
				if (localStorage.length > 0){
					var storageObj = {};
					for (var i = 0; i < localStorage.length; i++){
						var key = localStorage.key(i);
						storageObj[key] = localStorage[key];
					}
					return storageObj;
				}
				return null;
			}
		}
	}
	else {
		
		function setCookie(name, val, duration){
			var expires = "";
			if (duration){
				var date = new Date();
				date.setDate(date.getDate() + duration);
				expires = " expires=%s;".format(
					(duration == -1) ? "Thu, 01-Jan-1970 00:00:01 GMT" : date.toGMTString()
				);
			}
			var cookie = "%s=%s;%s path=/".format(name, val, expires);
			document.cookie = cookie;
		}
		
		return {
			setVal : function(name, val, duration){
				setCookie(name, val, duration || 365);
			},
			
			getVal : function(name){ return this.readCookieVal(name); },

			readCookieVal : function(name){
				var cookieObj = {};
				var cookies = document.cookie.split(/;\s*/);
				for (i = 0; i < cookies.length; i++){
					var cookie = cookies[i].split("=");
					cookieObj[cookie[0]] = cookie[1];
				}
				if (name) { return cookieObj[name]; }
				return cookieObj;
			},
			
			clearVals : function(){
				if (arguments.length == 0){
					var cookies = this.readCookieVal();
					for (var cookie in cookies){
						setCookie(cookie, "", -1);
					}
				}
				else {
					for (var i = 0; i < arguments.length; i++){
						setCookie(arguments[i], "", -1);
					}
				}
			},
			getData : function(){
				if (document.cookie) {
					return this.readCookieVal();
				}
				return null;
			}
		}
	}
	
};

