function homeCtrl($q, $scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient, Event, $location, $http) {
  if( !UserService.isLogged() ) {
    $state.go('login');
    return;
  }
  $scope.showSearchField = false; 
  // Disable right snap. Works with 'snap-options' option of tag snap-content.
  $scope.snapOptions = {
    disable: 'right'
  };

  $scope.goBack = function(){
    $state.go('home.events')
    return
  }
  var
      authToken = UserService.currentUser.auth_token

  $scope.currentCompany = CompanyService.currentCompany;
  // Options for User Interface in home partial
  $scope.UserInterface = UserInterface;
  $scope.UserInterface.title = "Home";
  $scope.isEventCompleted = true
  $scope.place_reference = ""

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

  $scope.photoForm = { 
      key: "",
      AWSAccessKeyId: "",
      policy: "",
      signature: ""
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
    })
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
  "$http"
];
