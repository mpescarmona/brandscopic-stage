'use strict';

/* Services */

angular.module('brandscopicApp.services', ['ngResource'])

.service('ApiParams', function() {
    this.baseUrl = "http://stage.brandscopic.com/api/v1";
    this.basePort = "";
})

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
  this.searching = false;
  this.AddIconState = "";
  this.eventSubNav = "";
  this.venueSubNav = "";
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

.service('VenuesRestClient', ['$resource', 'ApiParams', 'CompanyService', function($resource, ApiParams, CompanyService) {
  var venueList = []
    , companyId = CompanyService.getCompanyId();

  this.getVenues = function(authToken, companyId, searchTerm) {
    return $resource( ApiParams.baseUrl + '/venues/search',
                        {},
                        // should do a GET call to /venues/search
                        {getVenues:{ method: 'GET',
                                headers: {'Accept': 'application/json'},
                                params: {auth_token: authToken, company_id: companyId, term: searchTerm},
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

  this.setVenues = function(venues) {
    venueList = venues;
  };

  this.getVenueById = function(venueId) {
    var myVenue =  [];
    for (var i = 0, venue; venue = venueList[i++];) {
      if (venue.id == venueId) {
        myVenue = venue;
        break;
      }
    };
    return myVenue;
  };

}])

.value('version', '0.1')
.value('loginPage', '/login');
