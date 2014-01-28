angular.module('brandscopicApp.sharedDirectives', [])
    .directive('scopicTypeahead', ['CompanyService', 'debounce', 'UserService', 'Venue', 'Event', function (CompanyService, debounce, UserService, Venue, Event) {
        "use strict";

        var controller = function ($scope, $attrs) {
        	$scope.searchModel = ""
		    $scope.itemsToShow = []
		    $scope.customTemplate = ""
		    var typeahead_type = undefined;
		    console.log($scope.$eval($attrs.isCustom))
		    $scope.isCustom = $scope.$eval($attrs.isCustom)

		    var _getSearch = function (value) {
		        var 
		          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
		        , actions = { 
		        	success: function (items) {
								if(typeahead_type === scopic.consts.typeahead_types.PLACES) {
	                                angular.forEach(items, function (item) {
	                                  	$scope.itemsToShow.push(item.label)
	                                });
                                }
                                if(typeahead_type === scopic.consts.typeahead_types.EVENTS) {
	                                angular.forEach(items.facets, function (item) {
	                                	if($scope.itemsToShow.indexOf(item.label) < 0) {
	                                  		$scope.itemsToShow.push(item.label)
	                                	}
	                                });
	        
                                }
		                      }
                     , error: function (event_error) {
	                            $scope.event_error = event_error
                        }
                    }

		      	switch($scope.$eval($attrs.type)) {
	                case scopic.consts.typeahead_types.PLACES:
	                	typeahead_type = scopic.consts.typeahead_types.PLACES
	                	Venue.search(credentials, actions)
	                    break;
	                case scopic.consts.typeahead_types.EVENTS: {
	                	typeahead_type = scopic.consts.typeahead_types.EVENTS
	                	Event.search(credentials, actions)
	                    break;
	                }
	            };
		    }
		    // When searchModel change make api call to get search result
		    $scope.$watch('searchModel', function (value) {
		        getDebouncedPlaces(value)
		    });
		    // Makes a debounced watch of the model to avoid calling multiple times to the API
		    var getDebouncedPlaces = debounce(function (value) {
		        _getSearch(value)
		    });
		};

        return {
            controller: controller,
            restrict: 'E',
            templateUrl: 'views/directives/templates/typeahead.html'
        };
    }]);

