var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {

      if( !UserService.isLogged() ) {
        $state.go('login')
        return
      }
      snapRemote.close()

      $scope.gotToState = function(newState) {
        $state.go(newState)
        return
      }

      $scope.showExpenses = false
      var
          ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "expenses", AddIconState: "home.events.details.expenses.add"}
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
                                                                    // Add test image if file_small comes empty or null
                                                                    for(var i = 0, item; item = expenses[i++];) {
                                                                      if (!(item.receipt))
                                                                        item.receipt = {file_small: 'assets/images/test.jpeg'}
                                                                      else
                                                                        if (!(item.receipt.file_small))
                                                                          item.receipt.file_small = 'assets/images/test.jpeg'
                                                                    }

                                                                    $scope.expenses = expenses
                                                                    if($scope.expenses.length)
                                                                      $scope.showExpenses = true
                                                                    
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

      $scope.customPermissionsHandler = function() {
        ui.hasAddIcon = UserService.permissionIsValid('events_create_expenses');
        angular.extend(UserInterface, ui);
      }

      Event.find(credentials, actions)

    }

module.controller('EventsExpensesController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Expense'
                                          ]

