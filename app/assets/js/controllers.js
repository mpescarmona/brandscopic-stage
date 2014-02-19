'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', ['model.event', 'model.campaign', 'model.expense', 'model.comment', 'model.eventContact', 'model.eventTeam', 'model.contact', 'model.country', 'model.venue', 'highcharts-ng'])
  .controller('MainController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.UserService = UserService;
    $scope.trigger = function (event, payload) {
      $scope.$broadcast(event, payload);
    }
  }])

  .controller('LoginController', ['$scope', '$state', 'UserService', 'CompanyService', 'SessionRestClient', 'CompaniesRestClient', function($scope, $state, UserService, CompanyService, SessionRestClient, CompaniesRestClient) {
    $scope.user = {'email': 'mpescarmona@gmail.com', 'password': 'Mario123'};

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

  .controller('EventsAboutController', ['$scope', '$window', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $window, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Event"
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    $scope.editUrl = "#home/events/" + $stateParams.eventId + "/edit"
                                    angular.extend(UserInterface, ui)
                              }
       }

    Event.find(credentials, actions)

    $scope.map_styles = [
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

    $scope.deleteEvent = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function (event) {
                            $scope.event = event
                            // $location.path("/home/events/" + event.id + "/about")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }

      $scope.event.active = false
      $scope.upload_photos = /upload photos/.test($scope.event.actions.join())
      Event.update(credentials, actions, $scope.event)
    }
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
                                                                  ui.title = event.campaign ? event.campaign.name : "Event"
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

      $scope.event.campaign_id = $scope.campaign ? $scope.campaign.id : 0
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
                                    ui.title = event.campaign ? event.campaign.name : "Event"
                                    angular.extend(UserInterface, ui)
                                    angular.extend(UserInterface, Event.getAllowedActions())
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface
                    }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'EventsRestClient', 'EventContact', 'EventTeam', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventsRestClient, EventContact, EventTeam) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gotToState = function(newState) {
      $state.go(newState);
      return;
    };


    $scope.deleteTeam = function(teamId, teamType) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, memberable_id: teamId, memberable_type: teamType }
        , actions = { success: function (contact) {
                        // workaround for remove the non 'Active' events
                        for(var i = 0, item; item = $scope.eventTeamItems[i++];) {
                          if (item.id == teamId) {
                            $scope.eventTeamItems.splice(i - 1, 1)
                          }
                        }

                        // $location.path("/home/events/" + $scope.event.id + "/people/team/add")
                      }
                    , error: function (team_error) {
                        $scope.team_error = team_error
                         console.log(team_error)
                      }
                    }

      EventTeam.delete(credentials, actions, $scope.event)
    }

    $scope.deleteContact = function(contactId, contactType) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: contactId, contactable_type: contactType }
        , actions = { success: function (contact) {
                        // remove the assigned contact from assignable contacts list
                        for(var i = 0, item; item = $scope.eventContactItems[i++];) {
                          if (item.id == contactId) {
                            $scope.eventContactItems.splice(i-1, 1)
                          }
                        }

                        // $location.path("/home/events/" + $scope.event.id + "/people/contacts/add")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
      EventContact.delete(credentials, actions, $scope.event)
    }


    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasEditIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people", hasAddPhoto: false}
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
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "People"
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.UserInterface = UserInterface

                                    // $scope.showPeople = "team"
                                    // $scope.UserInterface.AddIconState = "home.events.details.people.team.add";
                                    $scope.showPeople = "contacts"
                                    $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add";
                                    $scope.showPeopleType = function(type) {
                                      $scope.showPeople = type
                                      if ($scope.showPeople =="team")
                                        $scope.UserInterface.AddIconState = "home.events.details.people.team.add"
                                      if ($scope.showPeople =="contacts")
                                        $scope.UserInterface.AddIconState = "home.events.details.people.contacts.add"
                                    }

                                    // get event Team members
                                    promiseTeam.then(function(responseTeam) {
                                     if (responseTeam.status == 200) {
                                      if (responseTeam.data != null) {
                                          eventTeamData = responseTeam.data
                                          $scope.eventTeamItems = eventTeamData
                                      }
                                     } else {
                                        $scope.eventTeamItems = {}
                                     }
                                    })
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventTeamItems = {}
                                    })

                                    // get event Contact members
                                    promiseContacts.then(function(responseContacts) {
                                     if (responseContacts.status == 200) {
                                      if (responseContacts.data != null) {
                                          eventContactsData = responseContacts.data
                                          $scope.eventContactItems = eventContactsData
                                      }
                                     } else {
                                        $scope.eventContactItems = {}
                                     }
                                    })
                                    promiseTeam.catch(function(responseTeam) {
                                      $scope.eventContactItems = {}
                                    })
                             }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleContactsController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', 'EventContact', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: 'Contact info', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasEditIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.eventId = $stateParams.eventId
                                    $scope.contactId = $stateParams.contactId
                                    $scope.UserInterface = UserInterface
                                    $scope.contact = []

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , options = { force: true }
                                      , actions = { success: function (contacts) {
                                                      // workaround to find the needed contact from contacts list
                                                      for(var i = 0, item; item = contacts[i++];) {
                                                        if (item.id == $stateParams.contactId) {
                                                          $scope.contact = item

                                                          ui.hasEditIcon = ((item.type == 'contact') ? true : false)
                                                          angular.extend(UserInterface, ui)
                                                          angular.extend($scope.UserInterface, ui)
                                                          break
                                                        }
                                                      }

                                                      // if the contact didn't found, means that is not assigned yet.
                                                      // So, we need to find it in assignable contact list
                                                      if ($scope.contact.length == 0) {
                                                        var assignableCredentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                                          , options = { force: true }
                                                          , assignableActions = { success: function (assignableContacts) {
                                                                // workaround to find the needed contact from contacts list
                                                                for(var i = 0, item; item = assignableContacts[i++];) {
                                                                  if (item.id == $stateParams.contactId) {
                                                                    $scope.contact = item

                                                                    ui.hasEditIcon = false
                                                                    angular.extend(UserInterface, ui)
                                                                    angular.extend($scope.UserInterface, ui)
                                                                    break
                                                                  }
                                                                }
                                                              }
                                                        }
                                                        EventContact.contacts(assignableCredentials, assignableActions, options)
                                                      }
                                                    }
                                                  }
                                    EventContact.all(credentials, actions, options)

                                    $scope.UserInterface.EditIconUrl = "#/home/events/" + $scope.event.id + "/people/contacts/" + $stateParams.contactId + "/edit";
                    }
       }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleContactsAddController', ['$scope', '$state', '$location', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'EventContact', function($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Contacts", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasEditIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "people", AddIconState: "home.events.details.people.contacts.new"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , options = { force: true }
                                      , actions = { success: function(contacts) {
                                                                  $scope.contacts = contacts
                                                                  // Options for User Interface in home partial
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId

                                                                  $scope.assignContact = function(contactId, contactType) {
                                                                    var
                                                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: contactId, contactable_type: contactType }
                                                                      , actions = { success: function (contact) {
                                                                                      // remove the assigned contact from assignable contacts list
                                                                                      for(var i = 0, item; item = $scope.contacts[i++];) {
                                                                                        if (item.id == contactId) {
                                                                                          $scope.contacts.splice(i-1, 1)
                                                                                        }
                                                                                      }

                                                                                      $location.path("/home/events/" + $scope.event.id + "/people/contacts/add")
                                                                                    }
                                                                                  , error: function (event_error) {
                                                                                      $scope.event_error = event_error
                                                                                       console.log(event_error)
                                                                                    }
                                                                                  }
                                                                    EventContact.create(credentials, actions, $scope.event)
                                                                  }
                                                             }
                                      }
                                    EventContact.contacts(credentials, actions, options)
                    }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsPeopleContactsEditController', ['$scope', '$state', '$location', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'EventContact', 'Contact', 'Country', function($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventContact, Contact, Country) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.getCountries = function() {
      var
          countries = []
        , credentials = { auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (countries) {
                        $scope.countries = countries
                      }
                    }
      Country.all(credentials, actions)
    }

    $scope.getStates = function(countryId) {
      var
          states = []
        , credentials = { auth_token: UserService.currentUser.auth_token, country_id: countryId }
        , actions = { success: function (states) {
                        $scope.states = states
                      }
                    }
      Country.states(credentials, actions)
    }

    $scope.getStatesForCountry = function() {
      var
          countryCode = $scope.contact.country
      $scope.getStates(countryCode)
    }

    var
        ui = {title: "Edit contact", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId
                                    $scope.contactId = $stateParams.contactId
                                    $scope.contact = []
                                    $scope.countries = []
                                    $scope.states = []
                                    $scope.countryCode = ""

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function (contacts) {
                                                      // workaround to find the needed contact from contacts list
                                                      for(var i = 0, item; item = contacts[i++];) {
                                                        if (item.id == $stateParams.contactId) {
                                                          $scope.contact = item
                                                          break
                                                        }
                                                      }

                                                      // if the contact didn't found, means that is not assigned yet.
                                                      // So, we need to find it in assignable contact list
                                                      if (!$scope.contact.id) {
                                                        var assignableActions = { success: function (assignableContacts) {
                                                                // workaround to find the needed contact from contacts list
                                                                for(var i = 0, item; item = assignableContacts[i++];) {
                                                                  if (item.id == $stateParams.contactId) {
                                                                    $scope.contact = item
                                                                    break
                                                                  }
                                                                }
                                                              }
                                                        }
                                                        EventContact.contacts(credentials, assignableActions)
                                                      }
                                                      if ($scope.contact.id) {
                                                        $scope.getCountries()

                                                        for(var i = 0, item; item = $scope.countries[i++];) {
                                                          if (item.name == $scope.contact.country) {
                                                            $scope.countryCode = item.id
                                                            break
                                                          }
                                                        }
                                                        $scope.getStates($scope.countryCode)
                                                      }
                                                    }
                                                  }
                                    EventContact.all(credentials, actions)
                    }
       }

    Event.find(credentials, actions)

    $scope.updateContact = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, contact_id: $stateParams.contactId }
        , actions = { success: function (contact) {
                            $scope.contact = contact
                            $location.path("/home/events/" + $scope.event.id + "/people")
                      }
                    , error: function (contact_error) {
                        $scope.contact_error = contact_error
                      }
                    }
      Contact.update(credentials, actions, $scope.contact)
    }

  }])

  .controller('EventsPeopleContactsNewController', ['$scope', '$state', '$location', '$stateParams', '$timeout', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'Contact', 'Country', 'EventContact', function($scope, $state, $location, $stateParams, $timeout, snapRemote, UserService, CompanyService, UserInterface, Event, Contact, Country, EventContact) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.contact = {}
    $scope.contact_error = undefined
    $scope.countries = []
    $scope.states = []
    $scope.countryCode = "US"

    $scope.getCountries = function() {
      var
          countries = []
        , credentials = { auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (countries) {
                        $scope.countries = countries
                      }
                    }
      Country.all(credentials, actions)
    }

    $scope.getStates = function(countryId) {
      var
          states = []
        , credentials = { auth_token: UserService.currentUser.auth_token, country_id: countryId }
        , actions = { success: function (states) {
                        $scope.states = states
                      }
                    }
      Country.states(credentials, actions)
    }

    $scope.getStatesForCountry = function() {
      var
          countryCode = $scope.contact.country
      $scope.getStates(countryCode)
    }

    $scope.getCountries()

    var
        ui = {title: "Contact", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }

    angular.extend(UserInterface, ui)
    $scope.UserInterface = UserInterface

    $scope.createContact = function(contact) {
      var
          foundContact = {}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
        , actions = { success: function (contact) {
                            $scope.contact = contact
                            var
                                credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, term: contact.full_name }
                              , options = { force: true }
                              , actions = { success: function(assignableContacts) {
                                                        // setup foundContact with recently created contact
                                                        // assuming type 'contact'. 
                                                        foundContact = contact
                                                        foundContact.type = "contact"
                                                        for(var i = 0, item; item = assignableContacts[i++];) {
                                                          if (contact.id == item.id) {
                                                            foundContact = item
                                                            break
                                                          }
                                                        }

                                                        var
                                                            credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, contactable_id: foundContact.id, contactable_type: foundContact.type }
                                                          , actions = { success: function (contact) {
                                                                          // remove the assigned contact from assignable contacts list

                                                                          $location.path("/home/events/" + $scope.event.id + "/people")
                                                                        }
                                                                      , error: function (event_error) {
                                                                          $scope.event_error = event_error
                                                                           console.log(event_error)
                                                                        }
                                                                      }
                                                        EventContact.create(credentials, actions, $scope.event)
                                                     }
                              }
                            // we need to wait a little time in order to allow assignable contacts method to fetch new contact
                            $timeout(EventContact.contacts(credentials, actions, options), 3000)
                      }
                    , error: function (contact_error) {
                        $scope.contact_error = contact_error
                      }
                    }
      Contact.create(credentials, actions, $scope.contact)
    }

  }])

  .controller('EventsPeopleTeamAddController', ['$scope', '$state', '$location', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'EventTeam', function($scope, $state, $location, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, EventTeam) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Event team", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasEditIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "people"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function(teams) {
                                                                  $scope.teams = teams

                                                                  $scope.assignTeam = function(teamId, teamType) {
                                                                    var
                                                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId, memberable_id: teamId, memberable_type: teamType }
                                                                      , actions = { success: function (contact) {
                                                                                      // workaround for remove the non 'Active' events
                                                                                      for(var i = 0, item; item = $scope.teams[i++];) {
                                                                                        if (item.id == teamId) {
                                                                                          $scope.teams.splice(i-1, 1)
                                                                                        }
                                                                                      }

                                                                                      $location.path("/home/events/" + $scope.event.id + "/people/team/add")
                                                                                    }
                                                                                  , error: function (team_error) {
                                                                                      $scope.team_error = team_error
                                                                                       console.log(team_error)
                                                                                    }
                                                                                  }

                                                                    EventTeam.create(credentials, actions, $scope.event)
                                                                  }
                                                             }
                                      }
                                    EventTeam.members(credentials, actions)
                    }
        }

   Event.find(credentials, actions)
  }])

  .controller('EventsDataController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasCloseIcon: false, showEventSubNav: true, eventSubNav: "data", hasAddPhoto: false}

      , authToken = UserService.currentUser.auth_token
      , companyId = CompanyService.getCompanyId()
      , eventId = $stateParams.eventId
      , eventResultsData = []
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Data"
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function(results) {
                                                                $scope.eventResultsItems = results
                                                             }
                                      }
                                    Event.results(credentials, actions)
                    }
        }
   Event.find(credentials, actions)

    $scope.updateEventData = function(results) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function (event) {
                            $scope.event = event
                            $location.path("/home/events/" + event.id + "/data/view")
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }
        , results_attributes = []

      for(var i = 0, result; result = results[i++];) {
        for(var j = 0, field; field = result.fields[j++];) {
          if (field.field_type == 'percentage') {
            for(var k = 0, segment; segment = field.segments[k++];) {
              if (segment.value !== null)
                results_attributes.push({'id': segment.id, 'value': segment.value})
            }
          }
          if (field.field_type == 'number') {
            if (field.value !== null)
              results_attributes.push({'id': field.id, 'value': field.value})
          }
          if (field.field_type == 'text') {
            if (field.value !== null)
              results_attributes.push({'id': field.id, 'value': field.value})
          }
          if (field.field_type == 'count') {
            if (field.options.capture_mechanism == "checkbox") {
              var segmentIds = []
              for(var k = 0, segment; segment = field.segments[k++];) {
                if (segment.value !== null)
                  segmentIds.push(segment.id)
              }
              if (segmentIds.length > 0)
                results_attributes.push({'id': field.id, 'value': segmentIds})
            } else {
              for(var k = 0, segment; segment = field.segments[k++];) {
                if (segment.value !== null) {
                  results_attributes.push({'id': field.id, 'value': segment.id})
                  break                        
                }
              }
            }
          }
        }
      }

      var data = {
                    "event": {
                      "summary": $scope.event.summary,
                      "results_attributes": results_attributes
                    }
                 }
      Event.updateResults(credentials, actions, data)
    }
  }])

  .controller('EventsDataViewController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event) {
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
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Data"
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function(results) {
                                                        var dataAgeCategories = []
                                                          , dataAgeSource = []
                                                          , gapAgeValue = []
                                                          , progressBarData = []
                                                          , ethnicData = []
                                                          , male = 0
                                                          , female = 0

                                                        for(var i = 0, result; result = results[i++];) {
                                                          // Get consumer reach values
                                                          if (result.module == 'consumer_reach') {
                                                            for(var j = 0, field; field = result.fields[j++];) {
                                                              if (field.goal && field.goal !== null) {
                                                                progressBarData.push( {value: field.value, name: field.name, percentage: (field.value * 100 / parseInt(field.goal))} )
                                                              }
                                                            }
                                                          }
                                                          if (result.module == 'demographics') {
                                                            for(var j = 0, field; field = result.fields[j++];) {
                                                              // Get Male and Female percentages
                                                              if (field.name == 'Gender') {
                                                                for(var k = 0, segment; segment = field.segments[k++];) {
                                                                  if (segment.text == 'Male')
                                                                    male = segment.value
                                                                  if (segment.text == 'Female')
                                                                    female = segment.value
                                                                }
                                                              }
                                                              // Get Age values
                                                              if (field.name == 'Age') {
                                                                for(var k = 0, segment; segment = field.segments[k++];) {
                                                                  dataAgeCategories.push(segment.text)
                                                                  dataAgeSource.push((segment.value) ? segment.value : 0)
                                                                  gapAgeValue.push(100 - ((segment.value) ? segment.value : 0))
                                                                }
                                                              }
                                                              // Get Ethnicity values
                                                              if (field.name == 'Ethnicity/Race') {
                                                                for(var k = 0, segment, item; segment = field.segments[k++];) {
                                                                  item = []
                                                                  item.push(segment.text)
                                                                  item.push(((segment.value) ? segment.value : 0))
                                                                  ethnicData.push(item)
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }

                                                        $scope.progressBarData = progressBarData
                                                        $scope.Male = male
                                                        $scope.Female = female

                                                        $scope.ageChart = {
                                                                          plotOptions: {
                                                                              bar: {
                                                                                  dataLabels: { enabled: false }
                                                                              },
                                                                              series: {
                                                                                  stacking: 'percent',
                                                                                  enableMouseTracking: false,
                                                                                  pointPadding: 0,
                                                                                  groupPadding: 0,
                                                                                  borderWidth: 0,
                                                                                  pointWidth: 15,
                                                                                  dataLabels: {
                                                                                      color: '#3E9CCF',
                                                                                      style: { fontSize: '11px' }
                                                                                  }
                                                                              }
                                                                          },
                                                                          options: {
                                                                            chart: { type: 'bar' },
                                                                            legend: { enabled: false },
                                                                            plotOptions: {
                                                                              series: { stacking: 'percent' }
                                                                            },
                                                                            tooltip: { enabled: false }
                                                                          },
                                                                          series: [
                                                                            {
                                                                              data: gapAgeValue,
                                                                              id: 'Serie1',
                                                                              name: 'Fill in',
                                                                              color: '#DFDFDF'
                                                                            },
                                                                            {
                                                                              data: dataAgeSource,
                                                                              id: 'Serie2',
                                                                              name: 'Values',
                                                                              color: '#3E9CCF',
                                                                              dataLabels: {
                                                                                      enabled: true,
                                                                                      format: '{y}%',
                                                                                      color: '#3E9CCF',
                                                                                      align: 'right',
                                                                                      x: 30,
                                                                                      y: -2,
                                                                                      style: { color: '#3E9CCF' }
                                                                                  }
                                                                            }
                                                                          ],
                                                                          title: { text: "" },
                                                                          xAxis: {
                                                                            currentMin: null,
                                                                            currentMax: null,
                                                                            categories: dataAgeCategories,
                                                                            title: { enabled: false },
                                                                            labels: {
                                                                              style: { color: '#3E9CCF', fontSize: '13px' }
                                                                            },
                                                                            tickLength: 0,
                                                                            lineWidth: 0
                                                                          },
                                                                          yAxis: {
                                                                            max: 100,
                                                                            labels: { enabled: false },
                                                                            title: { text: false },
                                                                            gridLineColor: 'transparent',
                                                                            enabled: false
                                                                          },
                                                                          credits: { enabled: false },
                                                                          loading: false
                                                                        }

                                                        $scope.ethnicityChart = {
                                                                plotOptions: {
                                                                    pie: { shadow: false },
                                                                    series: {
                                                                      enableMouseTracking: false,
                                                                      dataLabels: {
                                                                        connectorColor: '#C0C0C0',
                                                                        softConnector: false
                                                                      }
                                                                    }
                                                                },
                                                                options: {
                                                                  chart: { type: 'pie' },
                                                                  colors: ['#347a99','#218ebf', '#41AAD8', '#6ebde7', '#94d6ed'],
                                                                  title: { text: null },
                                                                  credits: { enabled: false },
                                                                  yAxis: { title: { text: null } },
                                                                  tooltip: { enabled: false }
                                                                },
                                                                series: [{
                                                                    name: 'Ethnicity',
                                                                    data: ethnicData,
                                                                    size: '60%',
                                                                    innerSize: '30%',
                                                                    distance: -10,
                                                                    dataLabels: {
                                                                        crop: false,
                                                                        formatter: function() {
                                                                            // display only if larger than 1
                                                                            return '<span style="font-size:16px;">'+ this.y +'%' +'</span><br /><div style="width: 50px;font-size:11px;">'+ this.point.name+'</div>';
                                                                        },
                                                                        color: '#3E9CCF',
                                                                    }
                                                                }]
                                                        }
                                                  }
                                      }
                                    Event.results(credentials, actions)
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

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: "home.events.details.comments.add", hasAddPhoto: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Comments"
                                    ui.hasAddIcon = Event.can('gather comments')
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , action = { success: function(comments) {
                                                                  $scope.comments = comments
                                                             }
                                                }

                                    Comment.all(credentials, action)
                              }
       }
    Event.find(credentials, actions)

  }])

  .controller('EventsCommentsAddController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'Comment', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Comment) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Comment", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event) {
                                    $scope.event = event;
                                    $scope.eventId = $stateParams.eventId;
                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui);
                                    $scope.UserInterface = UserInterface;

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

    Event.find(credentials, actions)

 }])

  .controller('EventsTasksController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService','UserInterface', 'Event', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasAddPhoto: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "tasks"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Tasks"
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
                                    }
                                    //$scope.goHere = function (hash) {
                                      //$location.path(hash);
                                    //};
                                    // remember to inject $location

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
                                    ui.title = event.campaign ? event.campaign.name : "Photos"
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;
                              }
       }

    Event.find(credentials, actions)

  }])


  .controller('EventsExpensesController', ['$scope', '$state', '$stateParams', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'Expense', function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {
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
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "expenses", AddIconState: "home.events.details.expenses.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event
                                    $scope.expenses = {}

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId

                                    var
                                        credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                      , actions = { success: function(expenses) {
                                                                  $scope.expenses = expenses
                                                                // Options for User Interface in home partial
                                                                  ui.title = event.campaign ? event.campaign.name : "Expenses"
                                                                  angular.extend(UserInterface, ui)
                                                                  $scope.UserInterface = UserInterface
                                                                  $scope.eventId = $stateParams.eventId

                                                                  $scope.total = function() {
                                                                      var total = 0

                                                                      for(var i = 0, item; item = $scope.expenses[i++];) {
                                                                        total += Number(item.amount)
                                                                      }
                                                                      return total
                                                                  }
                                                             }
                                      }
                                    Expense.all(credentials, actions)
                              }
       }

    Event.find(credentials, actions)

  }])

  .controller('EventsExpensesAddController', ['$scope', '$state', '$stateParams', '$location', 'snapRemote', 'UserService', 'CompanyService', 'UserInterface', 'Event', 'Expense', function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    var
        ui = {title: "Expense", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "expenses", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.createExpense = function() {
                                      var
                                          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                        , actions = { success: function (expense) {
                                                            $scope.event_expense = expense
                                                            $location.path("/home/events/" + event.id + "/expenses")
                                                      }
                                                    , error: function (expense_error) {
                                                        $scope.expense_error = expense_error
                                                         console.log(expense_error)
                                                      }
                                                    }
                                      Expense.create(credentials, actions, $scope.event_expense)
                                    }
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
        ui = {hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "surveys",  AddIconState: "home.events.details.surveys.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Surveys"
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
