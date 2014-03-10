'use strict';

/* Services */

angular.module('brandscopicApp.services', ['ngResource', 'ngCookies'])

.service('ApiParams', function() {
    this.baseUrl = "http://stage.brandscopic.com/api/v1";
    this.basePort = "";
})

.service('UserService', ['$cookieStore', function($cookieStore) {
	this.currentUser = {
		isLogged: false,
		email: '',
		auth_token: '',
    current_company_id: 0
	};
  this.isLogged = function() {
    var sessionData = $cookieStore.get('sessionData');
		return ( sessionData != null);
	};
}])

.service('CompanyService', function() {
  this.currentCompany = {
    id: 0,
    name: '[Choose Company]',
  };
  this.getCompanyId = function() {
    return this.currentCompany.id;
  };
})

.service('UserInterface', function() {
  this.Title = "";
  this.hasMagnifierIcon = false;
  this.hasAddIcon = false;
  this.hasSaveIcon = false;
  this.hasEditSurveyIcon = false;
  this.hasCancelIcon = false;
  this.hasMenuIcon = true;
  this.hasDeleteIcon = false;
  this.hasBackIcon = false;
  this.hasCloseIcon = false;
  this.searching = false;
  this.AddIconState = "";
  this.CloseState = "";
  this.eventSubNav = "";
  this.venueSubNav = "";
  this.actionSave = "";
  this.showEventSubNav = true;
  this.showVenueSubNav = true;
  this.hasCustomHomeClass = false;
  this.EditIconUrl = "";
  this.noData = false;
  this.hasAddPhoto = false;
})

.service('SessionRestClient', ['$resource', 'ApiParams', function($resource, ApiParams) {

  this.login = function(email, password) {
    return $resource( ApiParams.baseUrl + '/sessions',
                        {},
                        // should do a POST call to /sessions with email and password
                        {login:{ method: 'POST',
                                headers: {'Accept': 'application/json'},
                                params: {email: email, password: password},
                                interceptor: {
                                                response: function (data) {
                                                    return data;
                                                },
                                                responseError: function (data) {
                                                    return data;
                                                }
                                              },
                                transformResponse: function(data, header) {
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Post(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
	};

  this.forgotPassword = function(email) {
    return $resource( ApiParams.baseUrl + '/users/password/new_password',
                        {},
                        // should do a POST call to /users/password/new_password with email and password
                        {forgotPassword:{ method: 'POST',
                                headers: {'Accept': 'application/json'},
                                params: {email: email},
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Post(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.logout = function(authToken) {
    return $resource( ApiParams.baseUrl + '/sessions',
                        {},
                        // should do a DELETE call to /sessions with authToken
                        {logout:{ method: 'DELETE',
                                headers: {'Accept': 'application/json'},
                                params: {id: authToken},
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
                                  if (data.toString() != "") {
                                    var wrapped = angular.fromJson(data);
                                    angular.forEach(wrapped.items, function(item, idx) {
                                       wrapped.items[idx] = new Post(item); //<-- replace each item with an instance of the resource object
                                    });
                                    return wrapped;
                                  } else {
                                    return data;
                                  }
                                }
                              }
                        });
  };
}])

.service('CompaniesRestClient', ['$resource', 'ApiParams', function($resource, ApiParams) {

  this.getCompanies = function(authToken) {
    return $resource( ApiParams.baseUrl + '/companies',
                        {},
                        // should do a GET call to /companies
                        {getCompanies:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken},
                                isArray: true,
                                interceptor: {
                                                response: function (data) {
                                                    //console.log('response in interceptor', data);
                                                    return data;
                                                },
                                                responseError: function (data) {
                                                    //console.log('error in interceptor', data);
                                                    return data;
                                                }
                                              },
                                transformResponse: function(data, header) {
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };
}])

.service('EventsRestClient', ['$resource', 'ApiParams', 'CompanyService', function($resource, ApiParams, CompanyService) {
  var
      eventList = {}
    , companyId = CompanyService.getCompanyId();

  this.getEvents = function(authToken, companyId) {
    return $resource( ApiParams.baseUrl + '/events',
                        {},
                        // should do a GET call to /events
                        {getEvents:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId},
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.getEventById = function(authToken, companyId, eventId) {
    return $resource( ApiParams.baseUrl + '/events/' + eventId,
                        {},
                        // should do a GET call to /events/:eventId
                        {getEventById:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId},
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.updateEvent = function(authToken, companyId, evt) {
    return $resource( ApiParams.baseUrl + '/events/' + evt.id,
                        {event: evt},
                        // should do a PUT call to /events/:eventId
                        {updateEvent:{ method: 'PUT',
                                headers: {'Accept': 'application/json'
                                          // , 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                                          // , 'Content-Type': undefined},
                                         },
                                params: {auth_token: authToken, company_id: companyId},

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

                                // transformRequest: function(obj) {
                                //   var str = [];
                                //   for(var p in obj)
                                //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                //   return str.join("&");
                                // },

                                // transformRequest: function (data, headerGetter) {
                                //     console.log('data in transformRequest', data);
                                //     console.log('header in transformRequest', headerGetter);
                                //     var result = JSON.stringify(data);
                                //     return result;
                                // },
                                transformResponse: function(data, header) {
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.getEventMembersById = function(authToken, companyId, eventId, type) {
    return $resource( ApiParams.baseUrl + '/events/' + eventId + '/members',
                        {},
                        // should do a GET call to /events/:eventId
                        {getEventMembersById:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId},
                                isArray: true,
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.getEventContactsById = function(authToken, companyId, eventId) {
    return $resource( ApiParams.baseUrl + '/events/' + eventId + '/contacts',
                        {},
                        // should do a GET call to /events/:eventId
                        {getEventContactsById:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId},
                                isArray: true,
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.getEventResultsById = function(authToken, companyId, eventId) {
    return $resource( ApiParams.baseUrl + '/events/' + eventId + '/results',
                        {},
                        // should do a GET call to /events/:eventId
                        {getEventResultsById:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId},
                                isArray: true,
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
                                  var wrapped = angular.fromJson(data);
                                  angular.forEach(wrapped.items, function(item, idx) {
                                     wrapped.items[idx] = new Get(item); //<-- replace each item with an instance of the resource object
                                  });
                                  return wrapped;
                                }
                              }
                        });
  };

  this.setEvents = function(events) {
    eventList = events;
  };

  this.getFacetByName = function(facetName) {
    var myFacet =  [];
    for (var i = 0, facet; facet = eventList.facets[i++];) {
      if (facet.label.toLowerCase() == facetName.toLowerCase()) {
        myFacet = facet.items;
        break;
      }
    };
    return myFacet;
  };
}])


.service('Event', ['$resource', function($resource) {
  return $resource('//stage.brandscopic.com/api/v1/events/:id.:format', {auth_token: '@token', format: 'json', company_id: '@company_id'},
  {
        'all'    : { method: 'GET', isArray: true }

      , 'get'    : { method: 'GET' }

      , 'create' : { method: 'POST'
                     , headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
                     , transformRequest: dataChanger('event')
                  }

      , 'save'   : { method: 'PUT'
                     , headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
                     , transformRequest: dataChanger('event')
                  }
  });
}])
.service('LoginManager', ['$cookieStore','UserService', 'CompanyService','SessionRestClient', function($cookieStore, UserService, CompanyService, SessionRestClient) {
  this.login = function (authToken, email, currentCompanyId, currentCompanyName) {
    UserService.currentUser.auth_token = authToken;
    UserService.currentUser.email = email;
    CompanyService.currentCompany.id = currentCompanyId;
    CompanyService.currentCompany.name = currentCompanyName;
    var sessionData = new LoginData(authToken, email, currentCompanyId, currentCompanyName);
    $cookieStore.put('sessionData', sessionData);
  };
  this.initializeSystem = function () {
    if (!this.isLogged()) return false;

    var loginData = $cookieStore.get('sessionData');
    UserService.currentUser.auth_token = loginData.authToken;
    UserService.currentUser.email = loginData.email;
    CompanyService.currentCompany.id = loginData.currentCompanyId;
    CompanyService.currentCompany.name = loginData.currentCompanyName;
  };
  this.logout = function (authToken, loggedOutCallback, errorLoggingOutCallback) {
    var
      session = new SessionRestClient.logout(authToken)
    , promise = session.logout().$promise

    promise.then(function(response) {
        UserService.currentUser.auth_token = "";
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
        $cookieStore.remove('sessionData');
        if (loggedOutCallback != null) {
          loggedOutCallback();
        }
      });
    promise.catch(function(response) {
      UserService.currentUser.auth_token = "";
      UserService.currentUser.isLogged = false;
      UserService.currentUser.email = "";
      $cookieStore.remove('sessionData');
      if (errorLoggingOut != null) {
        errorLoggingOutCallback(response);
      }
      return false;
    });
  };
  this.isLogged = function () {
    return $cookieStore.get('sessionData') != null;
  };
}])
.service('HistoryService', ['$state', function($state) {
  this.states = [];

  this.goBack = function () {
    var state = this.states.pop();
    //The popped state could be the same as the current one when hitting the back button twice in a row.
    while (state != null && $state.current.name === state.name) {
      state = this.states.pop();
    }
    if (state != null) {
      $state.go(state);
    }
  };

  this.addState = function (state) {
    for(var i = this.states.length - 1; i >= 0; i--) {
      if(this.states[i] === state) {
         this.states.splice(i, 1);
      }
    }
    this.states.push(state);
  };

  this.clearHistory = function () {
    this.states = [];
  };
}])

.value('version', '0.1')
.value('loginPage', '/login');
