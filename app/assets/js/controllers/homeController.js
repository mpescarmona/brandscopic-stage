function homeCtrl($q, $scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location, $http, Notification, LoginManager, HistoryService) {

  if( !LoginManager.isLogged() ) {
    $state.go('login');
    return;
  } else {
    LoginManager.initializeSystem();
  }
  $scope.showSearchField = false;
  // Disable right snap. Works with 'snap-options' option of tag snap-content.
  $scope.snapOptions = {
    disable: 'right'
  };

  var
      authToken = UserService.currentUser.auth_token,
      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'status[]': 'Active' },
      pendingNotifications = 0;

  $scope.currentCompany = CompanyService.currentCompany;
  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface;
  $scope.UserInterface.title = "Home";
  $scope.isEventCompleted = true
  $scope.place_reference = ""

  $scope.logout = function() {
    LoginManager.logout(authToken, function() { 
      $state.go('login');
    });
    return false;
  };

  $scope.photoForm = {
      key: "",
      AWSAccessKeyId: "",
      policy: "",
      signature: ""
  };

	$scope.showSearchEvent = function(isShowing) {
		$scope.showSearchField = isShowing;
    $scope.$broadcast("ALL_EVENT", isShowing);
	};

  $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#home/events'},
                            {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#home/tasks'},
                            {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#home/venues'},
                            {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#home/notifications'},
                            {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#home/dashboard'}];

  $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#home/profile', 'click': ''},
                        {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '', 'click': 'logout()'}];


  function sentForm() {
    var url = $scope.photoForm.url; // El script a dónde se realizará la petición.
    var formData = {
                     key:$scope.photoForm.key,
                     AWSAccessKeyId: $scope.photoForm.AWSAccessKeyId,
                     acl: "private",
                     success_action_redirect: "http://localhost/",
                     policy: $scope.photoForm.policy,
                     signature: $scope.photoForm.signature,
                     ContentType: "image/jpeg"
                   };

    $.ajax({
          type: "POST",
           url: $scope.photoForm.url,
           data: formData, // Adjuntar los campos del formulario enviado.
            success: function(data, textStatus, jqXHR) {
                 console.log(data)
             },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus)
                console.log(errorThrown)
            }
         });
  }

  $scope.$on('ADD_PHOTO', function (eventT, authForm) {
      $scope.photoForm.AWSAccessKeyId = authForm.fields.AWSAccessKeyId
      $scope.photoForm.policy = authForm.fields.policy
      $scope.photoForm.signature = authForm.fields.signature
      $scope.photoForm.url = authForm.url
  });

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (fromState.data && fromState.data.shouldRememberInHistory) {
      HistoryService.addState(fromState);
    }
  });

  var notificationsActions = { success: function(notifications) {
    pendingNotifications = notifications.length;
  }};

  Notification.all(credentials, notificationsActions);
}

homeCtrl.$inject = [
  "$q",
  "$scope",
  "$state",
  "snapRemote",
  "UserService",
  "UserInterface",
  "CompanyService",
  "SessionRestClient",
  "Event",
  "$location",
  "$http",
  'Notification',
  'LoginManager',
  'HistoryService'
];
