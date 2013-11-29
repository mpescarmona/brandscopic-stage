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
    $scope.eventsItems = {

    "page": 1,
    "total": 7334,
    "facets": [
        {
            "label": "Campaigns",
            "items": [
                {
                    "label": "Kahlua Midnight FY14",
                    "id": 33,
                    "count": 1204,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Jameson Locals FY14",
                    "id": 5,
                    "count": 1139,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Jameson Evolved MBN Program FY14",
                    "id": 32,
                    "count": 922,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu Island Spiced MBN FY14",
                    "id": 38,
                    "count": 482,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu Combo MBN FY14",
                    "id": 37,
                    "count": 398,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT Large Shaker FY14",
                    "id": 21,
                    "count": 378,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Paddy MBN FY14",
                    "id": 40,
                    "count": 359,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT Bloody FY14",
                    "id": 57,
                    "count": 352,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Mama Walker's MBN FY14",
                    "id": 2,
                    "count": 324,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu MC FY14",
                    "id": 49,
                    "count": 223,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Jameson MC FY14 - PRN14JW01",
                    "id": 51,
                    "count": 214,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT BA FY14",
                    "id": 14,
                    "count": 164,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "English Gins Connoisseurs FY14",
                    "id": 48,
                    "count": 144,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Pernod Absinthe BA FY14",
                    "id": 41,
                    "count": 107,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Olmeca Altos BA FY14",
                    "id": 47,
                    "count": 100,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Kahlua MC FY14 - PRN14KA01",
                    "id": 56,
                    "count": 91,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT Bloody Incremental FY14",
                    "id": 22,
                    "count": 86,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Ricard BA FY14",
                    "id": 43,
                    "count": 66,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu Combo BEP FY14",
                    "id": 36,
                    "count": 60,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "TR Absolut Originality ",
                    "id": 58,
                    "count": 58,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Kahlua Midnight FY14 Lab Visit",
                    "id": 34,
                    "count": 53,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT Texas Incremental Mini Shaker",
                    "id": 55,
                    "count": 50,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Kahlua Midnight Off Premise FY13",
                    "id": 27,
                    "count": 49,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu Island Spiced SMBN FY14",
                    "id": 39,
                    "count": 44,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "ABSOLUT MC Mini Shaker TEXAS FY14",
                    "id": 54,
                    "count": 43,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Absolut MC Large Shaker FY14",
                    "id": 52,
                    "count": 42,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Chivas BA Program FY14",
                    "id": 23,
                    "count": 39,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu BA Program FY14",
                    "id": 31,
                    "count": 37,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Chivas Tribe Events FY14",
                    "id": 24,
                    "count": 21,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Kahlua Midnight FY14 Late Night Snack",
                    "id": 26,
                    "count": 17,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Chivas Night Bottle MC FY14",
                    "id": 20,
                    "count": 15,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Malibu Black FY14- Minneapolis Incremental",
                    "id": 35,
                    "count": 14,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "Jameson MC FY14",
                    "id": 16,
                    "count": 13,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "MOS Staff Training FY14",
                    "id": 12,
                    "count": 9,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "FY14 Prestige Events",
                    "id": 42,
                    "count": 9,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "MOS One-Off FY14",
                    "id": 11,
                    "count": 3,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "TGL Whisky Shows FY14",
                    "id": 50,
                    "count": 3,
                    "name": "campaign",
                    "selected": false
                },
                {
                    "label": "MOS Distributor Training FY14",
                    "id": 4,
                    "count": 2,
                    "name": "campaign",
                    "selected": false
                }
            ]
        },
        {
            "label": "Brands",
            "items": [
                {
                    "label": "Jameson Whiskey",
                    "id": 8,
                    "name": "brand",
                    "count": 2288,
                    "selected": false
                },
                {
                    "label": "Kahlua Rum",
                    "id": 26,
                    "name": "brand",
                    "count": 1414,
                    "selected": false
                },
                {
                    "label": "Malibu Rum",
                    "id": 22,
                    "name": "brand",
                    "count": 1258,
                    "selected": false
                },
                {
                    "label": "Absolut",
                    "id": 11,
                    "name": "brand",
                    "count": 1115,
                    "selected": false
                },
                {
                    "label": "Paddy Irish Whiskey",
                    "id": 27,
                    "name": "brand",
                    "count": 359,
                    "selected": false
                },
                {
                    "label": "Mama Walker's",
                    "id": 2,
                    "name": "brand",
                    "count": 324,
                    "selected": false
                },
                {
                    "label": "Beefeater",
                    "id": 10,
                    "name": "brand",
                    "count": 144,
                    "selected": false
                },
                {
                    "label": "Plymouth",
                    "id": 9,
                    "name": "brand",
                    "count": 144,
                    "selected": false
                },
                {
                    "label": "Pernod Absinthe",
                    "id": 17,
                    "name": "brand",
                    "count": 107,
                    "selected": false
                },
                {
                    "label": "Olmeca Altos Tequila",
                    "id": 21,
                    "name": "brand",
                    "count": 100,
                    "selected": false
                },
                {
                    "label": "Chivas Regal",
                    "id": 4,
                    "name": "brand",
                    "count": 75,
                    "selected": false
                },
                {
                    "label": "Ricard",
                    "id": 19,
                    "name": "brand",
                    "count": 66,
                    "selected": false
                },
                {
                    "label": "Travel Retail",
                    "id": 20,
                    "name": "brand",
                    "count": 58,
                    "selected": false
                },
                {
                    "label": "Prestige",
                    "id": 18,
                    "name": "brand",
                    "count": 9,
                    "selected": false
                },
                {
                    "label": "The Glenlivet",
                    "id": 5,
                    "name": "brand",
                    "count": 3,
                    "selected": false
                }
            ]
        },
        {
            "label": "Areas",
            "items": [
                {
                    "label": "Los Angeles",
                    "id": 17,
                    "count": 327,
                    "name": "area"
                },
                {
                    "label": "Provincetown",
                    "id": 62,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Rehoboth Beach",
                    "id": 64,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Cleveland",
                    "id": 27,
                    "count": 0,
                    "name": "area"
                },
                {
                    "label": "Seattle",
                    "id": 13,
                    "count": 0,
                    "name": "area"
                },
                {
                    "label": "Ft. Lauderdale",
                    "id": 34,
                    "count": 22,
                    "name": "area"
                },
                {
                    "label": "Chicago",
                    "id": 7,
                    "count": 111,
                    "name": "area"
                },
                {
                    "label": "College Station",
                    "id": 1,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Madison",
                    "id": 2,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Boston",
                    "id": 5,
                    "count": 53,
                    "name": "area"
                },
                {
                    "label": "New Orleans",
                    "id": 4,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Metro New York",
                    "id": 14,
                    "count": 27,
                    "name": "area"
                },
                {
                    "label": "Philadelphia",
                    "id": 6,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Syracuse",
                    "id": 8,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Denver",
                    "id": 9,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "San Diego",
                    "id": 11,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Austin",
                    "id": 12,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Minneapolis",
                    "id": 3,
                    "count": 81,
                    "name": "area"
                },
                {
                    "label": "Ann Arbor",
                    "id": 19,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Asbury Park",
                    "id": 20,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Atlanta",
                    "id": 21,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Baltimore",
                    "id": 22,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Bloomington",
                    "id": 23,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Boulder",
                    "id": 24,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Buffalo",
                    "id": 25,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Cincinnati",
                    "id": 26,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Grand Rapids",
                    "id": 36,
                    "count": 42,
                    "name": "area"
                },
                {
                    "label": "Columbus",
                    "id": 28,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "D.C.",
                    "id": 29,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Dallas",
                    "id": 30,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Detroit",
                    "id": 31,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Fairfield",
                    "id": 32,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Fire Island",
                    "id": 33,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Gainesville",
                    "id": 35,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Houston",
                    "id": 37,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Indianapolis",
                    "id": 38,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Kansas City",
                    "id": 39,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Las Vegas",
                    "id": 40,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Long Island/Hamptons",
                    "id": 41,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Milwaukee",
                    "id": 43,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Ocean City",
                    "id": 44,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "East Lansing",
                    "id": 18,
                    "count": 0,
                    "name": "area"
                },
                {
                    "label": "New Jersey (South)",
                    "id": 61,
                    "count": 0,
                    "name": "area"
                },
                {
                    "label": "San Francisco",
                    "id": 16,
                    "count": 327,
                    "name": "area"
                },
                {
                    "label": "Orange County",
                    "id": 15,
                    "count": 327,
                    "name": "area"
                },
                {
                    "label": "Sacramento",
                    "id": 10,
                    "count": 327,
                    "name": "area"
                },
                {
                    "label": "Miami",
                    "id": 42,
                    "count": 22,
                    "name": "area"
                },
                {
                    "label": "Orlando",
                    "id": 45,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Phoenix",
                    "id": 46,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Pittsburg",
                    "id": 47,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Portland",
                    "id": 48,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Rio Grande Valley",
                    "id": 49,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Rochester",
                    "id": 50,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "San Antonio",
                    "id": 51,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "San Jose",
                    "id": 52,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "State College",
                    "id": 54,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Tampa",
                    "id": 55,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Virginia Beach",
                    "id": 56,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Baton Rouge",
                    "id": 57,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "Santa Barbara",
                    "id": 58,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "New Jersey (North)",
                    "id": 60,
                    "count": 0,
                    "name": "area"
                },
                {
                    "label": "Raleigh",
                    "id": 63,
                    "count": 1241,
                    "name": "area"
                },
                {
                    "label": "St. Louis",
                    "id": 53,
                    "count": 1241,
                    "name": "area"
                }
            ]
        },
        {
            "label": "People",
            "items": [
                {
                    "label": "George Huss",
                    "id": 69,
                    "count": 135,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Joy Wolf",
                    "id": 62,
                    "count": 103,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Chris Greenland",
                    "id": 57,
                    "count": 91,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Jill Zachmann",
                    "id": 301,
                    "count": 86,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Santos Ruiz",
                    "id": 68,
                    "count": 84,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Laura Leathers",
                    "id": 54,
                    "count": 81,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Raquel Bernal",
                    "id": 167,
                    "count": 80,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Brook Brooks",
                    "id": 172,
                    "count": 80,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Alex MacKinnon",
                    "id": 67,
                    "count": 68,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Joey Maloney",
                    "id": 55,
                    "count": 65,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Chris Decker",
                    "id": 187,
                    "count": 63,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Aaron Sinfield",
                    "id": 58,
                    "count": 62,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Vincent Wagliardo",
                    "id": 294,
                    "count": 60,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Risa Sepkowski",
                    "id": 65,
                    "count": 56,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Tiffiny Milian",
                    "id": 247,
                    "count": 51,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Renee Edwards",
                    "id": 191,
                    "count": 49,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Brett Buckelew",
                    "id": 176,
                    "count": 49,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Paul O'Callaghan",
                    "id": 59,
                    "count": 49,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Christina Tracy",
                    "id": 64,
                    "count": 48,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Dillon Lockwood",
                    "id": 56,
                    "count": 47,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Katie Small",
                    "id": 282,
                    "count": 46,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Laura Kelly",
                    "id": 8,
                    "count": 45,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Kelly Walker",
                    "id": 295,
                    "count": 45,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Liz Harper",
                    "id": 98,
                    "count": 44,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Tana Perry",
                    "id": 255,
                    "count": 44,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Shelby Sampson",
                    "id": 270,
                    "count": 43,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Amena White",
                    "id": 27,
                    "count": 42,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Yelitza Reveles",
                    "id": 262,
                    "count": 41,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Alicia Gillum",
                    "id": 204,
                    "count": 40,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Kelli Hagen",
                    "id": 11,
                    "count": 39,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Lisa Conry",
                    "id": 37,
                    "count": 39,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Catherine Reuter",
                    "id": 84,
                    "count": 38,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Heather Johnson",
                    "id": 225,
                    "count": 37,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Taylor Travaglione",
                    "id": 52,
                    "count": 36,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Stephanie DiLanzo",
                    "id": 25,
                    "count": 35,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Robert Cuthbert",
                    "id": 185,
                    "count": 35,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Laurie Hess",
                    "id": 19,
                    "count": 34,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Ashley Delorey",
                    "id": 99,
                    "count": 34,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Caitlin McCauley",
                    "id": 246,
                    "count": 34,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Rebecca Brancato",
                    "id": 170,
                    "count": 34,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Maria Wojtowicz",
                    "id": 24,
                    "count": 33,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Melissa Thomas",
                    "id": 289,
                    "count": 33,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Irina Romanyuk",
                    "id": 266,
                    "count": 33,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Jessica Doris",
                    "id": 189,
                    "count": 32,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Paula Zuniga",
                    "id": 302,
                    "count": 32,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Natalie Gleaves",
                    "id": 205,
                    "count": 31,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Lorena Serrano",
                    "id": 278,
                    "count": 31,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Oonagh Buckley",
                    "id": 60,
                    "count": 30,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Corina Matias",
                    "id": 244,
                    "count": 30,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Caitlin Stadler",
                    "id": 284,
                    "count": 29,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Rainier Negri",
                    "id": 76,
                    "count": 28,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Tonya May",
                    "id": 245,
                    "count": 28,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Shawn Richardz",
                    "id": 263,
                    "count": 26,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Janiece Sarduy",
                    "id": 272,
                    "count": 26,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Jason Garza",
                    "id": 203,
                    "count": 26,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Gina Mondi",
                    "id": 249,
                    "count": 25,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Becca Kromer",
                    "id": 10,
                    "count": 24,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Briana White",
                    "id": 298,
                    "count": 23,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Andrew Kim",
                    "id": 234,
                    "count": 23,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Kandeel Iqbal",
                    "id": 223,
                    "count": 23,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Lauren Todorovich",
                    "id": 291,
                    "count": 23,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Gretchen Boren",
                    "id": 169,
                    "count": 23,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Martina Chan",
                    "id": 180,
                    "count": 22,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Chelsea Kenig",
                    "id": 232,
                    "count": 22,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Julia Rivera",
                    "id": 265,
                    "count": 21,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Hilary Graves",
                    "id": 210,
                    "count": 20,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Miguel Galan",
                    "id": 199,
                    "count": 20,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Daniel Wysocki",
                    "id": 299,
                    "count": 19,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Rocio Gomez",
                    "id": 209,
                    "count": 19,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Elizabeth Marrero",
                    "id": 97,
                    "count": 19,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Melissa Martie",
                    "id": 243,
                    "count": 19,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Cacia Phillips",
                    "id": 95,
                    "count": 19,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Kayla Schaefer",
                    "id": 110,
                    "count": 18,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Jill Darr",
                    "id": 22,
                    "count": 18,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Mario Hardy",
                    "id": 213,
                    "count": 18,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Cassie Campbell",
                    "id": 177,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Andrea Garza",
                    "id": 202,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Fred Sarkis",
                    "id": 127,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Val Howard",
                    "id": 92,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Stephanie Juliao",
                    "id": 229,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Ismael Valdez",
                    "id": 293,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Necole Elias",
                    "id": 192,
                    "count": 17,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Alison Miller",
                    "id": 248,
                    "count": 16,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Abbie Buchan",
                    "id": 175,
                    "count": 16,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Kisty Allen",
                    "id": 161,
                    "count": 16,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Damarys Baduy",
                    "id": 164,
                    "count": 15,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Lauren Redmond",
                    "id": 257,
                    "count": 15,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Jessica Resch",
                    "id": 260,
                    "count": 15,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Carly Bennyhoff",
                    "id": 30,
                    "count": 14,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Molly Smith",
                    "id": 13,
                    "count": 14,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Lauren Jessop",
                    "id": 12,
                    "count": 14,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Cynthia Esqueda",
                    "id": 193,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Brittany Relyea",
                    "id": 259,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Dan Engel",
                    "id": 86,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Rachel Carlino",
                    "id": 94,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Dale Smith",
                    "id": 283,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Sara Laplanche",
                    "id": 237,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Marisol Leon",
                    "id": 239,
                    "count": 13,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "David Iannone",
                    "id": 63,
                    "count": 12,
                    "name": "user",
                    "selected": false
                },
                {
                    "label": "Cassandra Ramos",
                    "id": 9,
                    "count": 12,
                    "name": "user",
                    "selected": false
                }
            ]
        },
        {
            "label": "Active State",
            "items": [
                {
                    "label": "Active",
                    "id": "Active",
                    "name": "status",
                    "count": 6864,
                    "selected": false
                },
                {
                    "label": "Inactive",
                    "id": "Inactive",
                    "name": "status",
                    "count": 470,
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
                    "count": 1749,
                    "selected": false
                },
                {
                    "label": "Due",
                    "id": "Due",
                    "name": "event_status",
                    "count": 70,
                    "selected": false
                },
                {
                    "label": "Submitted",
                    "id": "Submitted",
                    "name": "event_status",
                    "count": 1779,
                    "selected": false
                },
                {
                    "label": "Rejected",
                    "id": "Rejected",
                    "name": "event_status",
                    "count": 279,
                    "selected": false
                },
                {
                    "label": "Approved",
                    "id": "Approved",
                    "name": "event_status",
                    "count": 2818,
                    "selected": false
                }
            ]
        }
    ],
    "results": [
        {
            "id": 5486,
            "start_date": "05/24/2014",
            "start_time": " 8:00 PM",
            "end_date": "05/24/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2624,
                "name": "Kelly's Pub Too",
                "latitude": 39.7924104,
                "longitude": -86.2514126,
                "formatted_address": "5341 W. 10th Street, Indianapolis, IN 46224",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "5341 W. 10th Street",
                "street_number": null,
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5199,
            "start_date": "05/03/2014",
            "start_time": " 6:30 PM",
            "end_date": "05/03/2014",
            "end_time": " 7:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2587,
                "name": "8 Seconds Saloon",
                "latitude": 39.767723,
                "longitude": -86.24897,
                "formatted_address": "111 North Lynhurst Drive, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "North Lynhurst Drive",
                "street_number": "111",
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 4924,
            "start_date": "04/17/2014",
            "start_time": " 7:00 PM",
            "end_date": "04/17/2014",
            "end_time": " 8:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2548,
                "name": "Tini",
                "latitude": 39.776928,
                "longitude": -86.146048,
                "formatted_address": "717 Massachusetts Avenue, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "Massachusetts Avenue",
                "street_number": "717",
                "zipcode": "46204"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5188,
            "start_date": "04/05/2014",
            "start_time": " 6:30 PM",
            "end_date": "04/05/2014",
            "end_time": " 7:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2587,
                "name": "8 Seconds Saloon",
                "latitude": 39.767723,
                "longitude": -86.24897,
                "formatted_address": "111 North Lynhurst Drive, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "North Lynhurst Drive",
                "street_number": "111",
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5471,
            "start_date": "03/17/2014",
            "start_time": " 7:00 PM",
            "end_date": "03/17/2014",
            "end_time": " 8:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2624,
                "name": "Kelly's Pub Too",
                "latitude": 39.7924104,
                "longitude": -86.2514126,
                "formatted_address": "5341 W. 10th Street, Indianapolis, IN 46224",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "5341 W. 10th Street",
                "street_number": null,
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5478,
            "start_date": "03/15/2014",
            "start_time": " 8:00 PM",
            "end_date": "03/15/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2629,
                "name": "Longacre Bar & Grill",
                "latitude": 39.694936,
                "longitude": -86.13713,
                "formatted_address": "4813 Madison Avenue, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "Madison Avenue",
                "street_number": "4813",
                "zipcode": "46227"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5466,
            "start_date": "03/15/2014",
            "start_time": " 6:00 PM",
            "end_date": "03/15/2014",
            "end_time": " 7:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2606,
                "name": "Big Daddy's Bar & Grill",
                "latitude": 39.73037,
                "longitude": -86.159007,
                "formatted_address": "2536 South Meridian Street, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "South Meridian Street",
                "street_number": "2536",
                "zipcode": "46225"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5348,
            "start_date": "03/14/2014",
            "start_time": " 9:30 PM",
            "end_date": "03/14/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2607,
                "name": "Tiki Bob's",
                "latitude": 39.763432,
                "longitude": -86.157925,
                "formatted_address": "231 South Meridian Street, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "South Meridian Street",
                "street_number": "231",
                "zipcode": "46225"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5176,
            "start_date": "03/08/2014",
            "start_time": " 6:30 PM",
            "end_date": "03/08/2014",
            "end_time": " 7:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2587,
                "name": "8 Seconds Saloon",
                "latitude": 39.767723,
                "longitude": -86.24897,
                "formatted_address": "111 North Lynhurst Drive, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "North Lynhurst Drive",
                "street_number": "111",
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6910,
            "start_date": "03/01/2014",
            "start_time": " 9:30 PM",
            "end_date": "03/01/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 115,
                "name": "Mystic Celt",
                "latitude": 41.944748,
                "longitude": -87.663824,
                "formatted_address": "3443 North Southport Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Southport Avenue",
                "street_number": "3443",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 6703,
            "start_date": "02/28/2014",
            "start_time": " 8:00 PM",
            "end_date": "02/28/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 117,
                "name": "High Dive",
                "latitude": 41.896036,
                "longitude": -87.676225,
                "formatted_address": "1938 West Chicago Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "West Chicago Avenue",
                "street_number": "1938",
                "zipcode": "60622"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5475,
            "start_date": "02/27/2014",
            "start_time": " 8:00 PM",
            "end_date": "02/27/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2624,
                "name": "Kelly's Pub Too",
                "latitude": 39.7924104,
                "longitude": -86.2514126,
                "formatted_address": "5341 W. 10th Street, Indianapolis, IN 46224",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "5341 W. 10th Street",
                "street_number": null,
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6909,
            "start_date": "02/22/2014",
            "start_time": " 9:30 PM",
            "end_date": "02/22/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 115,
                "name": "Mystic Celt",
                "latitude": 41.944748,
                "longitude": -87.663824,
                "formatted_address": "3443 North Southport Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Southport Avenue",
                "street_number": "3443",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5167,
            "start_date": "02/22/2014",
            "start_time": " 6:30 PM",
            "end_date": "02/22/2014",
            "end_time": " 7:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2587,
                "name": "8 Seconds Saloon",
                "latitude": 39.767723,
                "longitude": -86.24897,
                "formatted_address": "111 North Lynhurst Drive, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "North Lynhurst Drive",
                "street_number": "111",
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6701,
            "start_date": "02/20/2014",
            "start_time": " 6:00 PM",
            "end_date": "02/20/2014",
            "end_time": " 7:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 117,
                "name": "High Dive",
                "latitude": 41.896036,
                "longitude": -87.676225,
                "formatted_address": "1938 West Chicago Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "West Chicago Avenue",
                "street_number": "1938",
                "zipcode": "60622"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5446,
            "start_date": "02/15/2014",
            "start_time": " 9:00 PM",
            "end_date": "02/15/2014",
            "end_time": "10:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 113,
                "name": "Red Ivy",
                "latitude": 41.946135,
                "longitude": -87.655563,
                "formatted_address": "3525 North Clark Street, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Clark Street",
                "street_number": "3525",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 4918,
            "start_date": "02/13/2014",
            "start_time": " 7:00 PM",
            "end_date": "02/13/2014",
            "end_time": " 8:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2548,
                "name": "Tini",
                "latitude": 39.776928,
                "longitude": -86.146048,
                "formatted_address": "717 Massachusetts Avenue, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "Massachusetts Avenue",
                "street_number": "717",
                "zipcode": "46204"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6908,
            "start_date": "02/08/2014",
            "start_time": " 9:30 PM",
            "end_date": "02/08/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 115,
                "name": "Mystic Celt",
                "latitude": 41.944748,
                "longitude": -87.663824,
                "formatted_address": "3443 North Southport Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Southport Avenue",
                "street_number": "3443",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5464,
            "start_date": "02/08/2014",
            "start_time": " 8:00 PM",
            "end_date": "02/08/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2624,
                "name": "Kelly's Pub Too",
                "latitude": 39.7924104,
                "longitude": -86.2514126,
                "formatted_address": "5341 W. 10th Street, Indianapolis, IN 46224",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "5341 W. 10th Street",
                "street_number": null,
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6700,
            "start_date": "02/07/2014",
            "start_time": " 8:00 PM",
            "end_date": "02/07/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 117,
                "name": "High Dive",
                "latitude": 41.896036,
                "longitude": -87.676225,
                "formatted_address": "1938 West Chicago Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "West Chicago Avenue",
                "street_number": "1938",
                "zipcode": "60622"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5437,
            "start_date": "02/01/2014",
            "start_time": " 9:00 PM",
            "end_date": "02/01/2014",
            "end_time": "10:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 113,
                "name": "Red Ivy",
                "latitude": 41.946135,
                "longitude": -87.655563,
                "formatted_address": "3525 North Clark Street, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Clark Street",
                "street_number": "3525",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5341,
            "start_date": "01/31/2014",
            "start_time": " 9:30 PM",
            "end_date": "01/31/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2549,
                "name": "Subterra Lounge",
                "latitude": 39.763068,
                "longitude": -86.158401,
                "formatted_address": "250 South Meridian Street, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "South Meridian Street",
                "street_number": "250",
                "zipcode": "46225"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 4436,
            "start_date": "01/25/2014",
            "start_time": "10:00 PM",
            "end_date": "01/25/2014",
            "end_time": "11:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 1651,
                "name": "Jimmy's Pizza Cafe",
                "latitude": 41.975775,
                "longitude": -87.692229,
                "formatted_address": "5159 North Lincoln Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Lincoln Avenue",
                "street_number": "5159",
                "zipcode": "60625"
            },
            "campaign": {
                "id": 56,
                "name": "Kahlua MC FY14 - PRN14KA01"
            }
        },
        {
            "id": 6907,
            "start_date": "01/25/2014",
            "start_time": " 9:30 PM",
            "end_date": "01/25/2014",
            "end_time": "10:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 115,
                "name": "Mystic Celt",
                "latitude": 41.944748,
                "longitude": -87.663824,
                "formatted_address": "3443 North Southport Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Southport Avenue",
                "street_number": "3443",
                "zipcode": "60657"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5158,
            "start_date": "01/25/2014",
            "start_time": " 6:30 PM",
            "end_date": "01/25/2014",
            "end_time": " 7:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2587,
                "name": "8 Seconds Saloon",
                "latitude": 39.767723,
                "longitude": -86.24897,
                "formatted_address": "111 North Lynhurst Drive, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "North Lynhurst Drive",
                "street_number": "111",
                "zipcode": "46224"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5045,
            "start_date": "01/24/2014",
            "start_time": " 8:00 PM",
            "end_date": "01/24/2014",
            "end_time": " 9:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2564,
                "name": "Joe's Grille",
                "latitude": 39.904463,
                "longitude": -86.052619,
                "formatted_address": "6645 East 82nd Street, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "East 82nd Street",
                "street_number": "6645",
                "zipcode": "46250"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 6698,
            "start_date": "01/23/2014",
            "start_time": " 6:00 PM",
            "end_date": "01/23/2014",
            "end_time": " 7:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 117,
                "name": "High Dive",
                "latitude": 41.896036,
                "longitude": -87.676225,
                "formatted_address": "1938 West Chicago Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "West Chicago Avenue",
                "street_number": "1938",
                "zipcode": "60622"
            },
            "campaign": {
                "id": 40,
                "name": "Paddy MBN FY14"
            }
        },
        {
            "id": 5146,
            "start_date": "01/17/2014",
            "start_time": " 6:00 PM",
            "end_date": "01/18/2014",
            "end_time": " 7:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 1824,
                "name": "That Place Bar & Grill",
                "latitude": 39.639346,
                "longitude": -86.083898,
                "formatted_address": "8810 South Emerson Avenue, Indianapolis, IN, United States",
                "country": "US",
                "state": "Indiana",
                "state_name": "Indiana",
                "city": "Indianapolis",
                "route": "South Emerson Avenue",
                "street_number": "8810",
                "zipcode": "46237"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 5269,
            "start_date": "01/17/2014",
            "start_time": " 5:00 PM",
            "end_date": "01/17/2014",
            "end_time": " 6:00 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 2595,
                "name": "Real Time Sports",
                "latitude": 41.993648,
                "longitude": -88.028883,
                "formatted_address": "1120 West Devon Avenue, Elk Grove Village, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Elk Grove Village",
                "route": "West Devon Avenue",
                "street_number": "1120",
                "zipcode": "60007"
            },
            "campaign": {
                "id": 33,
                "name": "Kahlua Midnight FY14"
            }
        },
        {
            "id": 4430,
            "start_date": "01/11/2014",
            "start_time": "10:30 PM",
            "end_date": "01/11/2014",
            "end_time": "11:30 PM",
            "status": "Active",
            "event_status": "Unsent",
            "place": {
                "id": 1651,
                "name": "Jimmy's Pizza Cafe",
                "latitude": 41.975775,
                "longitude": -87.692229,
                "formatted_address": "5159 North Lincoln Avenue, Chicago, IL, United States",
                "country": "US",
                "state": "Illinois",
                "state_name": "Illinois",
                "city": "Chicago",
                "route": "North Lincoln Avenue",
                "street_number": "5159",
                "zipcode": "60625"
            },
            "campaign": {
                "id": 56,
                "name": "Kahlua MC FY14 - PRN14KA01"
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
    