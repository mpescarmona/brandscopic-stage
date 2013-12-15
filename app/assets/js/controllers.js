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

    // Disable right snap. Works with 'snap-options' option of tag snap-content.
    $scope.snapOptions = {
      disable: 'right'
    };

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

    // $scope.eventsItems = EventsRestClient.getEventsMocked();
    // var eventList = $scope.eventsItems;
    // var eventGroups = [];
    // for (var i = 0, item, found; item = eventList[i++];) {
    //   found = false;
    //   for(var j = 0, group; group = eventGroups[j];) {
    //     if (item.start_date == group) {
    //       found = true;
    //       break;
    //     }
    //   }
    //   if (!found) {
    //     eventGroups.push(item.start_date);
    //   }
    // };
    // $scope.eventsGroups = eventGroups;

    // $scope.statusCount = EventsRestClient.getFacetByName("Event Status");
    var statusList = EventsRestClient.getFacetByName("Event Status");
    var filteredList =  [];

    // temporary harcoding to hide Event Status 'Approved'
    for (var i = 0, item; item = statusList[i++];) {
      if (item.label != 'Approved') {
        filteredList.push(item);
      }
    };
    $scope.statusCount = filteredList;

    $scope.event_status = false;


    var eventList = new EventsRestClient.getEvents(UserService.currentUser.auth_token, 1);
    var promise = eventList.getEvents().$promise;
    promise.then(function(response) {
     if (response.status == 200) {
      if (response.data != null) {
          $scope.eventsItems = response.data;
          return;
      }
     } else {
        $scope.eventsItems = {};
     }
    });
    promise.catch(function(response) {
      $scope.eventsItems = {};
    });


    $scope.filterStatus = function(status) {
      $scope.event_status = ($scope.event_status == status) ? false : (($scope.event_status == false) ? status : $scope.event_status);
    };
  }])

  .controller('EventsAboutController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

    // $scope.center = {
    //     latitude:  -32.926448,  // initial map center latitude
    //     longitude: -68.813779   // initial map center longitude
    // };
    // $scope.markers = [];         // an array of markers,
    // $scope.zoom = 8;             // the zoom level


//     angular.element(document).ready(function () {
//         console.log('Hello World');
// window.MAP_STYLES = [
//     {
//       stylers: [
//         { hue: "#00ffe6" },
//         { saturation: -100 },
//         { gamma: 0.8 }
//       ]
//     },{
//       featureType: "road",
//       elementType: "geometry",
//       stylers: [
//         { lightness: 100 },
//         { visibility: "simplified" }
//       ]
//     },{
//       featureType: "road",
//       elementType: "labels",
//       stylers: [
//         { visibility: "off" }
//       ]
//     },{
//       featureType: "road.arterial",
//       elementType: "geometry",
//       stylers: [
//         { color: "#BABABA" }
//       ]
//     }
//   ]
//     });

    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "about";
    $scope.eventAbout = EventsRestClient.getEventById($stateParams.eventId);

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
  }])

  .controller('EventsDataController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = false;
    $scope.UserInterface.hasAddIcon = false;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "data";

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsCommentsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
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
    $scope.UserInterface.eventSubNav = "comments";

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsTasksController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    // $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.title = 'Tasks';
    $scope.UserInterface.hasMagnifierIcon = true;
    $scope.UserInterface.hasAddIcon = false;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "tasks";

    $scope.eventId = $stateParams.eventId;

    $scope.eventTaskItems = [{'id': 1, 'assigned': 'Chris Jaskot', 'Task': 'Pickup t-shirts from storage unit', 'date': '2013-12-13', 'task_status': 'Late'},
                             {'id': 2, 'assigned': 'George Tan', 'Task': 'Confirm time and location of event', 'date': '2013-12-13', 'task_status': 'Incomplete'},
                             {'id': 3, 'assigned': '', 'Task': 'Hire models for event', 'date': '2013-12-13', 'task_status': 'Unassigned'},
                             {'id': 4, 'assigned': 'George Tan', 'Task': 'Identify drink recipes for promotion', 'date': '2013-12-13', 'task_status': 'Late'},
                             {'id': 5, 'assigned': 'Chris Jaskot', 'Task': 'Order ballons for the event', 'date': '2013-12-13', 'task_status': 'Late'},
                             {'id': 6, 'assigned': 'Chris Jaskot', 'Task': 'Order ballons for the event', 'date': '2013-12-13', 'task_status': 'Incomplete'},
                             {'id': 7, 'assigned': '', 'Task': 'Identify catering provider', 'date': '2013-12-13', 'task_status': 'Unassigned'},
                             {'id': 8, 'assigned': 'Chris Jaskot', 'Task': 'Select event presenter', 'date': '2013-12-13', 'task_status': 'Incomplete'}];

    $scope.eventTaskFilters = [{'label': 'Late',
                                'id': 'Late',
                                'name': 'task_status',
                                'count': 3,
                                'selected': false
                                },
                                {
                                'label': 'Unassigned',
                                'id': 'Unassigned',
                                'name': 'task_status',
                                'count': 2,
                                'selected': false
                                },
                                {
                                'label': 'Incomplete',
                                'id': 'Incomplete',
                                'name': 'task_status',
                                'count': 3,
                                'selected': false
                                }];

    $scope.task_status = false;
    $scope.filterTask = function(status) {
      $scope.task_status = ($scope.task_status == status) ? false : (($scope.task_status == false) ? status : $scope.task_status);
    };
  }])

  .controller('EventsPhotosController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = false;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "photos";

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsExpensesController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = false;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "expenses";

    $scope.eventId = $stateParams.eventId;
  }])

  .controller('EventsSurveysController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;
    $scope.UserInterface.title = EventsRestClient.getEventName($stateParams.eventId);
    $scope.UserInterface.hasMagnifierIcon = false;
    $scope.UserInterface.hasAddIcon = true;
    $scope.UserInterface.searching = false;
    $scope.UserInterface.eventSubNav = "surveys";

    $scope.eventId = $stateParams.eventId;
  }]);
        