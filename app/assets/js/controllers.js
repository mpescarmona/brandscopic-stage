'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', ['model.event', 'model.campaign', 'model.expense', 'model.comment'])
  .controller('MainController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.UserService = UserService;
  }])

  .controller('LoginController', ['$scope', '$state', 'UserService', 'CompanyService', 'SessionRestClient', 'CompaniesRestClient', function($scope, $state, UserService, CompanyService, SessionRestClient, CompaniesRestClient) {
    $scope.user = {'email': '', 'password': ''};

    $scope.wrongUser = null;
    $scope.validateApiUser = function() {
      var
          session = new SessionRestClient.login($scope.user.email, $scope.user.password)
        , promiseLogin = session.login().$promise
        , companyData = []
        , authToken = UserService.currentUser.auth_token
        , companies = null
        , promiseCompanies = null

      promiseLogin.then(function(response) {
       if (response.status == 200) {
        if (response.data.success == true) {
            $scope.wrongUser = false;
            UserService.currentUser.auth_token = response.data.data.auth_token;
            UserService.currentUser.isLogged = true;
            UserService.currentUser.email = $scope.user.email;
            UserService.currentUser.current_company_id = response.data.data.current_company_id;

            companies = new CompaniesRestClient.getCompanies(UserService.currentUser.auth_token)
            promiseCompanies = companies.getCompanies().$promise

            promiseCompanies.then(function(responseCompanies) {
             if (responseCompanies.status == 200) {
              if (responseCompanies.data != null) {
                  companyData = responseCompanies.data;

                  for (var i = 0, company; company = companyData[i++];) {
                    if (company.id == UserService.currentUser.current_company_id) {
                      CompanyService.currentCompany.id = company.id;
                      CompanyService.currentCompany.name = company.name;
                      break;
                    }
                  };
                  return;
              }
             }
            });
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
      promiseLogin.catch(function(response) {
        $scope.wrongUser = true;
        UserService.currentUser.auth_token = "";
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
      });
    };

    $scope.forgotPassword = function(email) {
      var
          session = new SessionRestClient.forgotPassword(email)
        , promise = session.forgotPassword().$promise

      promise.then(function(response) {
       if (response.status == 200) {
        UserService.currentUser.isLogged = false;
        UserService.currentUser.email = "";
        $state.go('login');
        return;
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
    }

    $scope.keyUpClear = function (e) {
        this.nextSibiling.className = (this.value.length) ? 'type-reset hidden' : 'type-reset'
    }

    $scope.keyDownClear = function (e) {
        this.value = ''
        this.netxSibiling.className = 'type-reset'
    }

    $scope.clickClear =  function (e){
        this.className = 'type-reset hidden'
        this.previousSibiling.value = ''
    }

  }])

  .controller('HomeController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface', 'CompanyService', 'SessionRestClient', function($scope, $state, snapRemote, UserService, UserInterface, CompanyService, SessionRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

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

    // $scope.gotToState = function(newState) {
    //   $state.go(newState);
    //   return;
    // };

    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#home/events'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#home/tasks'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#home/venues'},
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

    var
        ui = {title: 'Dashboard', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui)

    $scope.dashboardItems = [{'id': 1, 'name': 'Gin BAs FY14', 'today': '30%', 'progress': '40%'},
                             {'id': 2, 'name': 'Jameson Locals FY14', 'today': '65%', 'progress': '10%'},
                             {'id': 3, 'name': 'Jameson CE FY13', 'today': '75%', 'progress': '60%'},
                             {'id': 4, 'name': 'Gin BAs FY14', 'today': '45%', 'progress': '80%'},
                             {'id': 5, 'name': 'Mama Walker\'s FY14', 'today': '65%', 'progress': '30%'},
                             {'id': 6, 'name': 'Royal Salute FY14', 'today': '25%', 'progress': '30%'}];
  }])

  .controller('EventsController', ['$scope', '$state', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event',  function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // Options for User Interface in home partial
    $scope.UserInterface = UserInterface;

    var
        ui = {title: 'Events',hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.events.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function(events, filters){
                               $scope.eventsItems = events
                               $scope.filters = filters
                                angular.extend(UserInterface, ui)
                              }
        }

    Event.all(credentials, actions)

   $scope.event_status = false;
          $scope.filterStatus = function(status) {
            $scope.event_status = ($scope.event_status == status) ? false : status;
          }
  }])

  .controller('EventsAboutController', ['$scope', '$window', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $window, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    $scope.editUrl = "#home/events/" + $stateParams.eventId + "/edit"
                                    angular.extend(UserInterface, ui)
                              }
       }

    Event.find(credentials, actions)

    $scope.map_styles     =  [
                {
                        stylers: [
                                { hue: "#00ffe6" },
                                { saturation: -100 },
                                { gamma: 0.8 }
                        ]
                },{
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                                { lightness: 100 },
                                { visibility: "simplified" }
                        ]
                },{
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                                { visibility: "off" }
                        ]
                },{
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [
                                { color: "#BABABA" }
                        ]
                }
        ]
  }])

  .controller('EventsAboutMapController', ['$scope', '$window', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $window, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    $scope.editUrl = "#home/events/" + $stateParams.eventId + "/edit"
                                    angular.extend(UserInterface, ui)
                              }
       }

    Event.find(credentials, actions)

    $scope.map_styles     =  [
                {
                        stylers: [
                                { hue: "#00ffe6" },
                                { saturation: -100 },
                                { gamma: 0.8 }
                        ]
                },{
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                                { lightness: 100 },
                                { visibility: "simplified" }
                        ]
                },{
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                                { visibility: "off" }
                        ]
                },{
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [
                                { color: "#BABABA" }
                        ]
                }
        ]
  }])

  .controller('EventsAddController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'Campaign', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Campaign) {
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
      $scope.event.campaign_id = $scope.campaign.id
      Event.create(credentials, actions, $scope.event)
    }
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  }])

  .controller('EventsEditController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'Campaign', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Campaign) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.event = {}

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, actionSave: 'updateEvent(' + $scope.event + ')'}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
                                      , actions = { success: function(campaigns) {
                                                                  $scope.campaigns = campaigns
                                                                // Options for User Interface in home partial
                                                                  ui.title = event.campaign.name
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId
                                                                  $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit"
                                                             }
                                      }
                                    Campaign.all(credentials, actions)
                             }
        }

    Event.find(credentials, actions)

    $scope.updateEvent = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function (event) {
                            $scope.event = event
                            $location.path("/home/events/" + event.id + "/about")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }

      $scope.event.campaign_id = $scope.event.campaign.id
      Event.update(credentials, actions, $scope.event)
    }

  }])

  .controller('EventsDetailsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface
                    }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gotToState = function(newState) {
      $state.go(newState);
      return;
    };

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}

      , eventTeamData = []
      , authToken = UserService.currentUser.auth_token
      , companyId = CompanyService.getCompanyId()
      , eventId = $stateParams.eventId
      , eventTeam = new EventsRestClient.getEventMembersById(authToken, companyId, eventId)
      , promiseTeam = eventTeam.getEventMembersById().$promise
      , eventContactsData = []
      , eventContacts = new EventsRestClient.getEventContactsById(authToken, companyId, eventId)
      , promiseContacts = eventContacts.getEventContactsById().$promise

      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface

                                    $scope.showPeople = "team"
                                    $scope.showPeopleType = function(type) {
                                      $scope.showPeople = type
                                    };
                                    // if ($scope.showPeople =="team") {
                                    //   $scope.UserInterface.AddIconState = "home.events.details.people.team.add";
                                    // } else {
                                      $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add";
                                    // }

                                    // get event Team members
                                    promiseTeam.then(function(responseTeam) {
                                     if (responseTeam.status == 200) {
                                      if (responseTeam.data != null) {
                                          eventTeamData = responseTeam.data;
                                          $scope.eventTeamItems = eventTeamData;
                                      }
                                     } else {
                                        $scope.eventTeamItems = {};
                                     }
                                    });
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventTeamItems = {};
                                    });

                                    // get event Contact members
                                    promiseContacts.then(function(responseContacts) {
                                     if (responseContacts.status == 200) {
                                      if (responseContacts.data != null) {
                                          eventContactsData = responseContacts.data;
                                          $scope.eventContactItems = eventContactsData;
                                      }
                                     } else {
                                        $scope.eventContactItems = {};
                                     }
                                    });
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventContactItems = {};
                                    });
                             }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleContactsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // $scope.gotToState = function(newState) {
    //   $state.go(newState);
    //   return;
    // };

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}

      , eventResultsData = []
      , eventResults = new EventsRestClient.getEventContactsById(authToken, companyId, eventId)
      , promiseResults = eventResults.getEventContactsById().$promise

      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface


                                    promiseResults.then(function(responseResults) {
                                     if (responseResults.status == 200) {
                                      if (responseResults.data != null) {
                                          eventResultsData = responseResults.data;
                                          $scope.eventResultsItems = eventResultsData;
                                      }
                                     } else {
                                        $scope.eventResultsItems = {};
                                     }
                                    });
                                    promiseResults.catch(function(responseResults) {
                                      $scope.eventResultsItems = {};
                                    });

                                    // $scope.showPeople = ($scope.showPeople == "") ? "team" : $scope.showPeople;
                                    $scope.showPeople = "team";

                                    $scope.showPeopleType = function(type) {
                                      $scope.showPeople = type;
                                    };
                                    // if ($scope.showPeople =="team") {
                                    //   $scope.UserInterface.AddIconState = "home.events.details.people.team.add";
                                    // } else {
                                      $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add";
                    }
       }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleAddController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface', 'Event', function($scope, $state, snapRemote, UserService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Contacts", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('EventsPeopleEditController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface', 'Event', function($scope, $state, snapRemote, UserService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Edit contact", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('EventsDataController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'EventsRestClient', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventsRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasCloseIcon: false, showEventSubNav: true, eventSubNav: "data"}

      , authToken = UserService.currentUser.auth_token
      , companyId = CompanyService.getCompanyId()
      , eventId = $stateParams.eventId
      , eventResultsData = []
      , eventResults = new EventsRestClient.getEventResultsById(authToken, companyId, eventId)
      , promiseResults = eventResults.getEventResultsById().$promise

      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    promiseResults.then(function(responseResults) {
                                     if (responseResults.status == 200) {
                                      if (responseResults.data != null) {
                                          eventResultsData = responseResults.data;
                                          $scope.eventResultsItems = eventResultsData;
                                      }
                                     } else {
                                        $scope.eventResultsItems = {};
                                     }
                                    });
                                    promiseResults.catch(function(responseResults) {
                                      $scope.eventResultsItems = {};
                                    });
                    }
        }
   Event.find(credentials, actions)

  }])

  .controller('EventsCommentsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'Comment', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Comment) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    // $scope.gotToState = function(newState) {
    //   $state.go(newState);
    //   return;
    // };

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: "home.events.details.comments.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , pepe = { success: function(comments) {
                                                                  $scope.comments = comments
                                                                // Options for User Interface in home partial
                                                                  // ui.title = event.campaign.name
                                                                  // angular.extend(UserInterface, ui)
                                                                  // $scope.UserInterface = UserInterface
                                                             }
                                                }

                                    Comment.all(credentials, pepe)
                              }
       }
    Event.find(credentials, actions)

  }])

  .controller('EventsCommentsAddController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'Event', 'Comment', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, Event, Comment) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Comment", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.eventId = $stateParams.eventId;
                                    // Options for User Interface in home partial
                                    $scope.event = event;

                                    $scope.createComment = function() {
                                      var
                                          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                        , actions = { success: function (comment) {
                                                            $scope.comment = comment
                                                            $location.path("/home/events/" + event.id + "/comments")
                                                      }
                                                    , error: function (comment_error) {
                                                        $scope.comment_error = comment_error
                                                         console.log(comment_error)
                                                      }
                                                    }
                                      Comment.create(credentials, actions, $scope.comment)
                                    }

                             }
        }
    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;

    Event.find(credentials, actions)

 }])

  .controller('EventsTasksController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    // $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit";


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
                                                                'label': 'Assigned',
                                                                'id': 'Assigned',
                                                                'name': 'task_status',
                                                                'count': 2,
                                                                'selected': false
                                                                },
                                                                {
                                                                'label': 'Incomplete',
                                                                'id': 'Incomplete',
                                                                'name': 'task_status',
                                                                'count': 2,
                                                                'selected': false
                                                                },
                                                                {
                                                                'label': 'Complete',
                                                                'id': 'Complete',
                                                                'name': 'task_status',
                                                                'count': 3,
                                                                'selected': false
                                                                }];

                                    $scope.task_status = false;
                                    $scope.filterTask = function(status) {
                                      $scope.task_status = ($scope.task_status == status) ? false : status;
                                    };

                              }

       }

   Event.find(credentials, actions)

  }])

  .controller('EventsTasksDetailsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Task details", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    // $scope.editUrl = "#/home/events/" + $stateParams.eventId + "/edit";
                                    $scope.eventId = $stateParams.eventId;
                                    $scope.taskId = $stateParams.taskId;
                              }

       }

    Event.find(credentials, actions)

  }])

  .controller('EventsTasksEditController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Edit task", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                                    $scope.taskId = $stateParams.taskId;
                              }

       }

    Event.find(credentials, actions)

  }])

  .controller('EventsPhotosController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "photos"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

  }])

  .controller('EventsPhotoSliderController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.events.details.photos", searching: false, eventSubNav: "photos"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.slides = [
                                        {image: 'assets/images/img00.jpg', description: 'Image 00'},
                                        {image: 'assets/images/img01.jpg', description: 'Image 01'},
                                        {image: 'assets/images/img02.jpg', description: 'Image 02'},
                                        {image: 'assets/images/img03.jpg', description: 'Image 03'},
                                        {image: 'assets/images/img04.jpg', description: 'Image 04'}
                                    ];

                                    $scope.direction = 'left';
                                    $scope.currentIndex = 0;

                                    $scope.setCurrentSlideIndex = function (index) {
                                        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
                                        $scope.currentIndex = index;
                                    };

                                    $scope.isCurrentSlideIndex = function (index) {
                                        return $scope.currentIndex === index;
                                    };

                                    $scope.prevSlide = function () {
                                        $scope.direction = 'left';
                                        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
                                    };

                                    $scope.nextSlide = function () {
                                        $scope.direction = 'right';
                                        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
                                    };
                              }
       }

   Event.find(credentials, actions)

  }])


  .controller('EventsExpensesController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'Expense', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gotToState = function(newState) {
      $state.go(newState);
      return;
    };

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "expenses", AddIconState: "home.events.details.expenses.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.total = function() {
                                        var total = 0

                                        for(var i = 0, item; item = $scope.expenses[i++], total += item.amount;)
                                        return total;
                                    }

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function(expenses) {
                                                                  $scope.expenses = expenses
                                                                // Options for User Interface in home partial
                                                                  ui.title = event.campaign.name
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId
                                                             }
                                      }
                                    Expense.all(credentials, actions)
                              }
       }

    Event.find(credentials, actions)

  }])

  .controller('EventsExpensesAddController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Expense", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "expenses", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

 }])

  .controller('EventsExpensesPhotoController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.events.details.expenses", searching: false, eventSubNav: "expenses"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                                    $scope.expenseId = $stateParams.expenseId;
                              }
       }

    Event.find(credentials, actions)

 }])

  .controller('EventsSurveysController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "surveys",  AddIconState: "home.events.details.surveys.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

  }])

  .controller('EventsSurveysAddController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Survey", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "expenses", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

 }])

  .controller('TasksController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface',  function($scope, $state, snapRemote, UserService, UserInterface) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        ui = { title: 'Tasks', hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('VenuesController', ['$scope', '$state', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'VenuesRestClient',  function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        ui = {title: 'Venues', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false, AddIconState: "home.venues.add"}
      , venuesList = []
      , authToken = UserService.currentUser.auth_token
      , companyId = CompanyService.getCompanyId()
      , searchTerm = ''
      , venueList = new VenuesRestClient.getVenues(authToken, companyId, searchTerm)
      , promise = venueList.getVenues().$promise

    angular.extend(UserInterface, ui)
    $scope.UserInterface = UserInterface;

    promise.then(function(response) {
     if (response.status == 200) {
      if (response.data != null) {
          $scope.venuesItems = response.data;

          VenuesRestClient.setVenues($scope.venuesItems);
          return;
      }
     } else {
        $scope.venuesItems = {};
     }
    });
    promise.catch(function(response) {
      $scope.venuesItems = {};
    });
  }])

  .controller('VenuesAddController', ['$scope', '$state', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        ui = { title: 'Venue', hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('VenuesDetailsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        eventData = []
      , token = UserService.currentUser.auth_token
      , venueId = $stateParams.venueId
      , currentVenue = new VenuesRestClient.getVenueById(venueId)
      , ui = { title: currentVenue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false}

    angular.extend(UserInterface, ui);

    $scope.venue = currentVenue;
  }])

  .controller('VenuesAboutController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        eventData = []
      , authToken = UserService.currentUser.auth_token
      , venueId = $stateParams.venueId
      , currentVenue = new VenuesRestClient.getVenueById(venueId)
      , ui = {title: currentVenue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "about"}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('VenuesAnalysisController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        eventData = []
      , authToken = UserService.currentUser.auth_token
      , venueId = $stateParams.venueId
      , currentVenue = new VenuesRestClient.getVenueById(venueId)
      , ui = {title: currentVenue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "analysis"}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('VenuesPhotosController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        eventData = []
      , authToken = UserService.currentUser.auth_token
      , venueId = $stateParams.venueId
      , currentVenue = new VenuesRestClient.getVenueById(venueId)
      , ui = {title: currentVenue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "photos"}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('VenuesCommentsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'UserInterface', 'VenuesRestClient', function($scope, $state, $stateParams, snapRemote, UserService, UserInterface, VenuesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        eventData = []
      , authToken = UserService.currentUser.auth_token
      , venueId = $stateParams.venueId
      , currentVenue = new VenuesRestClient.getVenueById(venueId)
      , ui = {title: currentVenue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "comments"}

    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }])

  .controller('CompaniesController', ['$scope', '$state', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'CompaniesRestClient', function($scope, $state, snapRemote, UserService, CompanyService, UserInterface, CompaniesRestClient) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.currentCompany = CompanyService.currentCompany;

    var
        companyData = []
      , authToken = UserService.currentUser.auth_token
      , companies = new CompaniesRestClient.getCompanies(authToken)
      , promise = companies.getCompanies().$promise
      , ui = {}

    promise.then(function(response) {
     if (response.status == 200) {
      if (response.data != null) {
          companyData = response.data;

          // Options for User Interface in home partial
          $scope.UserInterface = UserInterface;
          ui = { title: 'Companies', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false};
          angular.extend(UserInterface, ui);

          $scope.companies = companyData;
          return;
      }
     } else {
        $scope.companies = {};
     }
    });
    promise.catch(function(response) {
      $scope.companies = {};
    });

    $scope.chooseCompany = function(companyId, companyName) {
      CompanyService.currentCompany.id = companyId;
      CompanyService.currentCompany.name = companyName;
      $state.go('home.dashboard');
      return;
    };
  }]);
