'use strict';

/* Services */

angular.module('brandscopicApp.services', ['ngResource'])
.service('UserService', function() {
	this.currentUser = {
		isLogged: false,
		email: '',
		auth_token: ''
	};
	this.isLogged = function() {
		return this.currentUser.isLogged;
	};
})

.service('UserInterface', function() {
  this.hasMagnifierIcon = false;
  this.hasAddIcon = false;
  this.Title = "";
})

.service('SessionRestClient', ['$resource', function($resource) {

  var baseUrl = "http://stage.brandscopic.com";
  var basePort = "";

  this.login = function(email, password) {
    return $resource( baseUrl + '/api/v1/sessions',
                        {},
                        // should do a POST call to /api/v1/sessions with email and password
                        {login:{ method: 'POST',
                                headers: {'Accept': 'application/json'},
                                params: {email: email, password: password},
                                interceptor: {
                                                response: function (data) {
                                                    console.log('response in interceptor', data);
                                                    return data;
                                                },
                                                responseError: function (data) {
                                                    console.log('error in interceptor', data);
                                                    return data;
                                                }
                                              },
                                transformResponse: function(data, header) {
                                  console.log('transformResponse->data: ' + data);
                                  console.log('transformResponse->header: ' + header);
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Post(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
	};
}])

.value('version', '0.1')
.value('loginPage', '/login');
