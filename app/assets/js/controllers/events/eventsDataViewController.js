var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event) {

      if( !UserService.isLogged() ) {
        $state.go('login')
        return
      }
      snapRemote.close()

      var
          ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasEditIcon: true, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasCloseIcon: false, showEventSubNav: true, eventSubNav: "data"}

        , authToken = UserService.currentUser.auth_token
        , companyId = CompanyService.getCompanyId()
        , eventId = $stateParams.eventId
        , eventResultsData = []
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event) {
                                      $scope.event = event
                                      $scope.UserInterface.EditIconUrl = "#/home/events/" + $scope.event.id + "/data"

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
                                                                              return '<span style="font-size:16px;">'+ this.y +'%' +'</span><br /><div style="width: 50px;font-size:11px;">'+ this.point.name+'</div>'
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
}

module.controller('EventsDataViewController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                          ]
