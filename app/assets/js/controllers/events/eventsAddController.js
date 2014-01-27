function eventsAddCtrl($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Campaign, Venue, debounce) {
	if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.event = {}
    $scope.campaigns = {}
    var
        ui = {title: 'Event', hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, actionSave: 'createEvent(' + $scope.event + ')'}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function(campaigns) {
                                    $scope.campaigns = campaigns
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface
                             }
        }

    Campaign.all(credentials, actions)

    $scope.editUrl = "#/home/events/add"

    $scope.createEvent = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (event) {
                            $scope.event = event
                            $location.path("/home/events/" + event.id + "/about")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
        , sm1 = $scope.event.start_date.indexOf('-')
        , sm2 = $scope.event.start_date.indexOf('/')
        , em1 = $scope.event.end_date.indexOf('-')
        , em2 = $scope.event.end_date.indexOf('/')
      if (sm1 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (sm2 == 4)
        $scope.event.start_date = $scope.event.start_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')
      if (em1 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1')
      if (em2 == 4)
        $scope.event.end_date = $scope.event.end_date.replace(/^(\d{4})\/(\d{2})\/(\d{2}).*$/, '$2/$3/$1')

      $scope.event.campaign_id = $scope.campaign ? $scope.campaign.id : 0
      Event.create(credentials, actions, $scope.event)
    }
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
