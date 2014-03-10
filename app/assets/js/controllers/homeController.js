function homeCtrl($q, $scope, $state, snapRemote, $sce, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location, $http, Notification, LoginManager, HistoryService) {

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

  $scope.navigationItems = [{'class': 'eventIcon'       , 'label': 'EVENTS'       , 'link': '#home/events'       , 'extraTag': undefined},
                            {'class': 'tasksIcon'       , 'label': 'TASKS'        , 'link': '#home/tasks'        , 'extraTag': undefined},
                            {'class': 'venuesIcon'      , 'label': 'VENUES'       , 'link': '#home/venues'       , 'extraTag': undefined},
                            {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#home/notifications', 'extraTag': $sce.trustAsHtml('<span class="badge">42</span>')},
                            {'class': 'dashboardIcon'   , 'label': 'DASHBOARD'    , 'link': '#home/dashboard'    , 'extraTag': undefined}];

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

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    var numberOfPoints = toState.name.split('.').length - 1;
    var isGoingToARootPlace = numberOfPoints == 1;
    if (isGoingToARootPlace) {
      HistoryService.clearHistory();
      HistoryService.addState(toState);
    } else if ((fromState.data && fromState.data.shouldRememberInHistory) || (toState.data && toState.data.parentShouldBeRemembered)) {
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
  "$sce",
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
