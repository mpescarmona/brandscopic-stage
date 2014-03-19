var module = angular.module('brandscopicApp.controllers')
  , controller = function ($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {

  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()

  var
      ui = {title: "", hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: true, showEventSubNav: false, hasCustomHomeClass: true, CloseState: "home.events.details.expenses", searching: false, eventSubNav: "expenses", hasAddPhoto: false}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
    , actions = { success: function(event){
                                  $scope.event = event

                                  // Options for User Interface in home partial
                                  angular.extend(UserInterface, ui)
                                  $scope.UserInterface = UserInterface
                                  $scope.eventId = $stateParams.eventId
                                  $scope.expenseId = $stateParams.expenseId

                                  var
                                      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                    , actions = { success: function(expenses) {
                                                                // Add test image if file_small comes empty or null
                                                                for(var i = 0, item; item = expenses[i++];) {
                                                                  if (item.id == $stateParams.expenseId) {
                                                                    if (!(item.receipt))
                                                                      item.receipt = {file_original: 'assets/images/test.jpeg'}
                                                                    else
                                                                      if (!(item.receipt.file_original))
                                                                        item.receipt.file_original = 'assets/images/test.jpeg'
                                                                    $scope.showExpenses = true
                                                                    $scope.expense = item
                                                                    
                                                                  }
                                                                }
                                                           }
                                    }
                                  Expense.all(credentials, actions)
                            }
     }
  Event.find(credentials, actions)
}

module.controller('EventsExpensesPhotoController'
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

