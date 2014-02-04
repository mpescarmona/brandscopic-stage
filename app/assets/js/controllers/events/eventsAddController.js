function eventsAddCtrl($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Campaign, Venue, debounce) {
	if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.event = {}
    $scope.campaigns = {}
    $scope.campaingsDrop = []

    var
        ui = {title: 'Event', hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, actionSave: 'createEvent(' + $scope.event + ')'}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function(campaigns) { 
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface
                                    angular.forEach(campaigns, function (value){
                                        $scope.campaingsDrop.push( { id: value.id, name: value.name })
                                    });
                             }
        }

    Campaign.all(credentials, actions)

    $scope.editUrl = "#/home/events/add"
    var _getSearch = function (value) {
        var 
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
        , actions = { 
                  success: function (items) {
                          $scope.itemsToShowPlaces = []
                          angular.forEach(items, function (item) {
                              $scope.itemsToShowPlaces.push({ label: item.label, id: item.id })
                          });

                      }
                 , error: function (event_error) {
                          $scope.event_error = event_error
                    }
                }
        console.log($scope.itemsToShowPlaces)
        Venue.search(credentials, actions)
    }

    $scope.$watch('event', function (eventObj) {
        $scope.$emit('CREATE_EVENT', eventObj)
    }, true);

    // When searchModel change make api call to get search result
    $scope.$watch('place_reference', function (value) {
        if(value) {
          $scope.event.place_reference = value.id
        }
        getDebouncedPlaces(value)
    });
    // Makes a debounced watch of the model to avoid calling multiple times to the API
    var getDebouncedPlaces = debounce(function (value) {
        _getSearch(value)
    });
}

eventsAddCtrl.$inject = [
    "$scope",
    "$state",
    "$stateParams",
    "$location",
    "snapRemote",
    "UserService",
    "CompanyService",
    "UserInterface",
    "Event",
    "Campaign",
    "Venue",
    "debounce"
];
