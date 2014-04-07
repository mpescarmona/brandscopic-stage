angular.module('brandscopicApp.services')
.service('SessionService', ['$sessionStorage', '$localStorage', function($sessionStorage, $localStorage){
	//When the program starts, we set the storage type as local storage to search for previously stored login data.
	//However, if $sessionStorage holds a variable called 'usingSession', it means that we were on session storage 
	//and simply refreshed the window, so we should search for our login data on the session storage.

	this.storageService = $localStorage;
	this.setStorageType = function(type) {
		if (type.toLowerCase() === 'local') {
			this.storageService = $localStorage;
			delete $sessionStorage.usingSession;
		} else if (type.toLowerCase() === 'session') {
			$sessionStorage.usingSession = true;
			this.storageService = $sessionStorage;
		} else {
			throw 'Invalid storage type';
		}
	};

	this.get = function(dataName) {
		return this.storageService[dataName];
	};

	this.put = function(dataName, data) {
		this.storageService[dataName] = data;
	};

	this.remove = function(dataName) {
		delete this.storageService[dataName];
		if (this.storageService === $localStorage) {
			delete this.storageService.usingSession;
		}
	};

	if ($sessionStorage.usingSession) {
		this.storageService = $sessionStorage;
	}
}]);