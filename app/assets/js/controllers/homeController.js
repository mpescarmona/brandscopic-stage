function homeCtrl($scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient) {

	if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    $scope.showSearchField = false; 
    // Disable right snap. Works with 'snap-options' option of tag snap-content.
    $scope.snapOptions = {
      disable: 'right'
    };

    var
      authToken = UserService.currentUser.auth_token

    $scope.currentCompany = CompanyService.currentCompany;
    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = "Home";

    $scope.logout = function() {
      var
          session = new SessionRestClient.logout(authToken)
        , promise = session.logout().$promise

      promise.then(function(response) {
        if (response.status == 200) {
          UserService.currentUser.auth_token = "";
          UserService.currentUser.isLogged = false;
          UserService.currentUser.email = "";
          $state.go('login');
          return;
        } else {
          // $state.go('login');
          $scope.wrongUser = true;
          UserService.currentUser.auth_token = "";
          UserService.currentUser.isLogged = false;
          UserService.currentUser.email = "";
        }
      });
      promise.catch(function(response) {
        $scope.wrongUser = true;
        UserService.currentUser.auth_token = "";
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
      });
    };

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

}

homeCtrl.$inject = [
    "$scope",
    "$state",
    "snapRemote",
    "UserService",
    "UserInterface",
    "CompanyService",
    "SessionRestClient"
];