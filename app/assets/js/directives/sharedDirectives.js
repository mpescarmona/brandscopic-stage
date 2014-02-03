angular.module('brandscopicApp.sharedDirectives', [])
    .directive('scopicTypeahead', ['CompanyService', 'debounce', 'UserService', 'Venue', 'Event', function (CompanyService, debounce, UserService, Venue, Event) {
        "use strict";

        var controller = function ($scope, $attrs) {
        	$scope.searchModel = ""
		    //$scope.itemsToShow = []
		    $scope.customTemplate = ""
		    //$scope.placeId = ""
		    var typeahead_type = undefined;
		    $scope.isCustom = $scope.$eval($attrs.isCustom)

		    var _getSearch = function (value) {
		        var 
		          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
		        , actions = { 
		        	success: function (items) {
								if(typeahead_type === scopic.consts.typeahead_types.PLACES) {
									$scope.itemsToShow = []
	                                angular.forEach(items, function (item) {
	                                  	$scope.itemsToShow.push({ label: item.label, id: item.id })
	                                });
                                }
                                if(typeahead_type === scopic.consts.typeahead_types.EVENTS) {
                                	$scope.itemsToShow = []
	                                angular.forEach(items.facets, function (item) {
	                                	angular.forEach(item.items, function (subItem) {
		                                		$scope.itemsToShow.push({ category: subItem.name, event: subItem.label, id: subItem.id })
		                                	});
	                                	});

	                                /*$scope.itemsToShow = []
	                                angular.forEach(items.facets, function (item) {
	                                	if(item.items.length > 0) {
	                                		$scope.itemsToShow.push(item)
	                                	}
	                                });*/
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
		    	$scope.placeId = value.id
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