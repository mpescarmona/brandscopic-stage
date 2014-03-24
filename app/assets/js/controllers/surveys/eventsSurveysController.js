var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, surveysService, Event) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        canCreateSurvey
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "surveys",  AddIconState: "home.events.details.surveys.add", hasAddPhoto: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event
                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Surveys"
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    angular.extend(UserInterface, ui)

                                    angular.forEach($scope.event.actions, function (item) {
                                        canCreateSurvey = item.indexOf("conduct surveys")
                                        if(canCreateSurvey != -1) {
                                          UserInterface.hasAddIcon = true
                                        }
                                    })

                              }
       }

    Event.find(credentials, actions)

    $scope.showSurveys = false
    surveysService.getSurveysList().then( function (response){
        if(response.length > 0)
          $scope.showSurveys = true
        $scope.suveySumaryList = []
        // TODO : use consts in the cases
        angular.forEach(response, function (items) {

          var _age = "", _race = "", _gender = ""
          angular.forEach(items.surveys_answers, function (item) {
            if(item.kpi_id != null) {
                switch(item.kpi_id) {
                  case 6:
                    if(item.answer == "10") {
                      _gender = "Male"
                    } else {
                      _gender = "Female"
                    }
                  break
                  case 7:
                      switch(item.answer) {
                        case "1"://scopic.consts.surveys_question_age.LESS12.toString():
                          _age = "Less 12"
                          break
                        case "2":// scopic.consts.surveys_question_age.BETWEEN_12_17.toString():
                          _age = "12 - 17"
                          break
                        case "387"://scopic.consts.surveys_question_age.BETWEEN_18_20.toString():
                          _age = "18 - 20"
                          break
                        case "3"://scopic.consts.surveys_question_age.BETWEEN_21_24.toString():
                          _age = "21 - 24"
                          break
                        case "4"://scopic.consts.surveys_question_age.BETWEEN_25_34.toString():
                          _age = "25 - 34"
                          break
                        case "5"://scopic.consts.surveys_question_age.BETWEEN_35_44.toString():
                          _age = "35 - 44"
                          break
                        case "6"://scopic.consts.surveys_question_age.BETWEEN_45_54.toString():
                          _age = "45 - 54"
                          break
                        case "7"://scopic.consts.surveys_question_age.BETWEEN_55_64.toString():
                          _age = "55 - 64"
                          break
                        case "8"://scopic.consts.surveys_question_age.MORE_65.toString():
                          _age = "More than 65"
                          break
                      }
                  case 8:
                      switch(item.answer) {
                        case "11"://scopic.consts.surveys_question_age.ASIAN.toString():
                          _race = "Asian"
                          break
                        case "12"://scopic.consts.surveys_question_age.BLACK.toString():
                          _racee = "Black / African American"
                          break
                        case "13"://scopic.consts.surveys_question_age.LATINO.toString():
                          _race = "Hispanic / Latino"
                          break
                        case "14"://scopic.consts.surveys_question_age.AMERICAN.toString():
                          _race = "Native American"
                          break
                        case "15"://scopic.consts.surveys_question_age.WHITE.toString():
                          _race = "White"
                          break
                      }
                }
            }
          })
        $scope.suveySumaryList.push( { id: items.id, age: _age, race: _race, gender: _gender, create: items.created_at, update: items.updated_at } )
      })
    })

    $scope.editSurvey = function (survey_id){
        $location.path("/home/events/" + $scope.eventId + "/surveys/" + survey_id + "/edit")
    }
}

module.controller('eventsSurveysController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'surveysService'
                                           , 'Event'
                                          ]
