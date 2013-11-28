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
       console.log("success: ", response);
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
        console.log("error: ", response); 
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

  .controller('EventsController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, snapRemote, UserService, UserInterface) {
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

    // $scope.eventsItems = [{'id': 1, 'name': 'Event One', 'today': '30%', 'progress': '40%'},
    //                       {'id': 2, 'name': 'Event Two', 'today': '65%', 'progress': '10%'},
    //                       {'id': 3, 'name': 'Event three', 'today': '75%', 'progress': '60%'}];
    $scope.eventsItems = {"page": 1,
                          "total": 1,
                          "facets": [
                              {
                                  "label": "Campaigns",
                                  "items": [
                                      {
                                          "label": "Jameson LOCALS",
                                          "id": 60,
                                          "count": 1,
                                          "name": "campaign",
                                          "selected": false
                                      }
                                  ]
                              },
                              {
                                  "label": "Brands",
                                  "items": [
                                      {
                                          "label": "Jameson LOCALS",
                                          "id": 13,
                                          "name": "brand",
                                          "count": 1,
                                          "selected": false
                                      }
                                  ]
                              },
                              {
                                  "label": "Areas",
                                  "items": []
                              },
                              {
                                  "label": "People",
                                  "items": []
                              },
                              {
                                  "label": "Active State",
                                  "items": [
                                      {
                                          "label": "Active",
                                          "id": "Active",
                                          "name": "status",
                                          "count": 1,
                                          "selected": false
                                      },
                                      {
                                          "label": "Inactive",
                                          "id": "Inactive",
                                          "name": "status",
                                          "count": 0,
                                          "selected": false
                                      }
                                  ]
                              },
                              {
                                  "label": "Event Status",
                                  "items": [
                                      {
                                          "label": "Late",
                                          "id": "Late",
                                          "name": "event_status",
                                          "count": 1,
                                          "selected": false
                                      },
                                      {
                                          "label": "Due",
                                          "id": "Due",
                                          "name": "event_status",
                                          "count": 0,
                                          "selected": false
                                      },
                                      {
                                          "label": "Submitted",
                                          "id": "Submitted",
                                          "name": "event_status",
                                          "count": 0,
                                          "selected": false
                                      },
                                      {
                                          "label": "Rejected",
                                          "id": "Rejected",
                                          "name": "event_status",
                                          "count": 0,
                                          "selected": false
                                      },
                                      {
                                          "label": "Approved",
                                          "id": "Approved",
                                          "name": "event_status",
                                          "count": 0,
                                          "selected": false
                                      }
                                  ]
                              }
                          ],
                          "results": [
                              {
                                  "id": 7334,
                                  "start_date": "11/20/2013",
                                  "start_time": " 4:45 AM",
                                  "end_date": "11/20/2013",
                                  "end_time": " 5:45 AM",
                                  "status": "Active",
                                  "event_status": "Unsent",
                                  "place": {
                                      "id": 3031,
                                      "name": "Bar None",
                                      "latitude": 40.732367,
                                      "longitude": -73.988044,
                                      "formatted_address": "98 3rd Avenue, New York, NY, United States",
                                      "country": "US",
                                      "state": "New York",
                                      "state_name": "New York",
                                      "city": "New York",
                                      "route": "3rd Avenue",
                                      "street_number": "98",
                                      "zipcode": "10003"
                                  },
                                  "campaign": {
                                      "id": 60,
                                      "name": "Jameson LOCALS"
                                  }
                              }
                          ]
                      };


  }])

  .controller('EventsDetailsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, $stateParams, snapRemote, UserService, UserInterface) {
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

    $scope.eventId = $stateParams.eventId;
    // $scope.eventsItems = [{'id': 1, 'name': 'Event One', 'today': '30%', 'progress': '40%'},
    //                       {'id': 2, 'name': 'Event Two', 'today': '65%', 'progress': '10%'},
    //                       {'id': 3, 'name': 'Event three', 'today': '75%', 'progress': '60%'}];
  }]);
    