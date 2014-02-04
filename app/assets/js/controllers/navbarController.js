function navbarCtrl($scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location) {

    $scope.showSearchField = false; 
    // Disable right snap. Works with 'snap-options' option of tag snap-content.
    $scope.snapOptions = {
      disable: 'right'
    };

    $scope.currentCompany = CompanyService.currentCompany;
    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = "Home";
    $scope.isEventCompleted = true

	$scope.showSearchEvent = function(isShowing) {
		$scope.showSearchField = isShowing;
	};	

    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#home/events'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#home/tasks'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#home/venues'},
                              {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#home/notifications'},
                              {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#home/dashboard'}];

    $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#home/profile', 'click': ''},
                          {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '#', 'click': 'logout()'}];

    function createEvent () {
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

      //$scope.event.campaign_id = $scope.campaign ? $scope.campaign.id : 0
      alert("intenta crear!");
      Event.create(credentials, actions, $scope.event)
    }

    $scope.CreateEventView = function () {
        alert("intenta crear el evento")
        if($scope.event) {
          createEvent();
        } else {
          alert("error esta completo el model");
        }
    }

    $scope.$on('CREATE_EVENT', function (eventT, eventObj) {
        if ( eventObj.campaign_id >= 0 && eventObj.end_date  &&  eventObj.end_time && eventObj.start_date && eventObj.start_time ) {
            $scope.isEventCompleted = false
            $scope.event = eventObj;
        }
        event.processed = true;
    });
}

navbarCtrl.$inject = [
    "$scope",
    "$state",
    "snapRemote",
    "UserService",
    "UserInterface",
    "CompanyService",
    "SessionRestClient",
    "Event",
    "$location"
];