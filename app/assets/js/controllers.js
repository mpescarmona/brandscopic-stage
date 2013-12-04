'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', [])
  .controller('MainController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.UserService = UserService;
  }])

  .controller('LoginController', ['$scope', '$state', 'UserService', 'SessionRestClient', function($scope, $state, UserService, SessionRestClient) {
    $scope.user = {'email': '', 'password': ''};

    $scope.wrongUser = null;
    $scope.validateApiUser = function() {
      var session = new SessionRestClient.login($scope.user.email, $scope.user.password);

      var promise = session.login().$promise;
      promise.then(function(response) {
       if (response.status == 200) {
        if (response.data.success == true) {
            $scope.wrongUser = false;
            UserService.currentUser.auth_token = response.data.data.auth_token;
            UserService.currentUser.isLogged = true;
            UserService.currentUser.email = $scope.user.email;
            $state.go('home.dashboard');
            return;
        }
       } else {
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
  }])

  .controller('HomeController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, snapRemote, UserService, UserInterface) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = "Home";
    // $scope.UserInterface.hasMagnifierIcon = false;
    // $scope.UserInterface.hasAddIcon = false;
    // $scope.UserInterface.searching = false;

    $scope.logout = function() {
      UserService.currentUser.isLogged = false;
      UserService.currentUser.email = "";
      $state.go('login');
      return;
    };

    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#home/events'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#'},
                              {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#'},
                              {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#home/dashboard'}];

    $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#', 'click': ''},
                          {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '#', 'click': 'logout()'}];
  }])

  .controller('DashboardController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, snapRemote, UserService, UserInterface) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    // Options for User Interface in home partial
    UserInterface.title = "Dashboard";
    UserInterface.hasMagnifierIcon = false;
    UserInterface.hasAddIcon = false;
    UserInterface.searching = false;

    $scope.dashboardItems = [{'id': 1, 'name': 'Gin BAs FY14', 'today': '30%', 'progress': '40%'},
                             {'id': 2, 'name': 'Jameson Locals FY14', 'today': '65%', 'progress': '10%'},
                             {'id': 3, 'name': 'Jameson CE FY13', 'today': '75%', 'progress': '60%'},
                             {'id': 4, 'name': 'Gin BAs FY14', 'today': '45%', 'progress': '80%'},
                             {'id': 5, 'name': 'Mama Walker\'s FY14', 'today': '65%', 'progress': '30%'},
                             {'id': 6, 'name': 'Royal Salute FY14', 'today': '25%', 'progress': '30%'}];
  }])

  .controller('EventsController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient',  function($scope, $state, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = "Events";
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;

    $scope.eventsItems = EventsRestClient.getEvents();
    $scope.statusCount = EventsRestClient.getFacetByName("Event Status");
    $scope.event_status = false;

    $scope.filterStatus = function(status) {
      $scope.event_status = ($scope.event_status == status) ? false : (($scope.event_status == false) ? status : $scope.event_status);
    };
  }])

  .controller('EventsAboutController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "about";

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsDetailsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsPeopleController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "people";

    $scope.eventId = $stateParams.eventId;

    $scope.showPeople = "team";

    $scope.showPeopleType = function(type) {
      $scope.showPeople = type;
    };
  }]);
    