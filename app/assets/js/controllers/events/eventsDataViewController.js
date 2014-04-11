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
                                      event.summary = (event.summary == 'null') ? null : event.summary
                                      event.data = (event.data) ? event.data : {spent_by_impression: null, spent_by_interaction: null, spent_by_sample: null}
                                      event.data.spent_by_impression = (event.data.spent_by_impression == 'NaN') ? null : event.data.spent_by_impression
                                      event.data.spent_by_interaction = (event.data.spent_by_interaction == 'NaN') ? null : event.data.spent_by_interaction
                                      event.data.spent_by_sample = (event.data.spent_by_sample == 'NaN') ? null : event.data.spent_by_sample

                                      $scope.event = event
                                      $scope.UserInterface.EditIconUrl = "#/home/events/" + $scope.event.id + "/data?edit"

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
                                                            , customData = []
                                                            , hasProgressBarData = false

                                                          for(var i = 0, result; result = results[i++];) {
                                                            // Get consumer reach values
                                                            if (result.module == 'consumer_reach') {
                                                              for(var j = 0, field; field = result.fields[j++];) {
                                                                if (field.goal && field.goal !== null) {
                                                                  progressBarData.push( {value: field.value, name: field.name, percentage: (field.value * 100 / parseInt(field.goal))} )
                                                                  hasProgressBarData = (field.value) ? true : false
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
                                                                  var showAge = false
                                                                  for(var k = 0, segment; segment = field.segments[k++];) {
                                                                    dataAgeCategories.push(segment.text)
                                                                    dataAgeSource.push((segment.value) ? segment.value : 0)
                                                                    gapAgeValue.push(100 - ((segment.value) ? segment.value : 0))
                                                                    showAge = (segment.value) ? true : showAge
                                                                  }
                                                                }
                                                                // Get Ethnicity values
                                                                if (field.name == 'Ethnicity/Race') {
                                                                  var showEthnicity = false
                                                                  for(var k = 0, segment, item; segment = field.segments[k++];) {
                                                                    item = []
                                                                    item.push(segment.text)
                                                                    item.push(((segment.value) ? segment.value : 0))
                                                                    ethnicData.push(item)
                                                                    showEthnicity = (segment.value) ? true : showEthnicity
                                                                  }
                                                                }
                                                              }
                                                            }
                                                            if (result.module == 'custom') {
                                                              for(var j = 0, field; field = result.fields[j++];) {
                                                                if (field.field_type == 'percentage') {
                                                                  customData.push( {value: field.options.predefined_value, name: field.name, ordering: field.ordering} )
                                                                }
                                                                if (field.field_type == 'number') {
                                                                  customData.push( {value: field.value, name: field.name, ordering: field.ordering} )
                                                                }
                                                                if (field.field_type == 'text') {
                                                                  customData.push( {value: field.value, name: field.name, ordering: field.ordering} )
                                                                }
                                                                if (field.field_type == 'count') {
                                                                  if (field.options.capture_mechanism == "checkbox") {
                                                                    var segmentValues = ''
                                                                    if (field.value)
                                                                      for(var k = 0, value; value = field.value[k++];) {
                                                                        for(var l = 0, segment; segment = field.segments[l++];) {
                                                                          if (segment.id == value) {
                                                                            segmentValues = segmentValues + segment.text + ', '
                                                                          }
                                                                        }
                                                                      }
                                                                    if (segmentValues != '')
                                                                      segmentValues = segmentValues.substring(0, segmentValues.lastIndexOf(', '))
                                                                    customData.push( {value: segmentValues, name: field.name, ordering: field.ordering} )
                                                                  } else {
                                                                    for(var k = 0, segment; segment = field.segments[k++];) {
                                                                      if (segment.id == field.value) {
                                                                        customData.push( {value: segment.text, name: field.name, ordering: field.ordering} )
                                                                        break
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }

                                                          $scope.progressBarData = progressBarData
                                                          $scope.Male = male
                                                          $scope.Female = female
                                                          $scope.customData = customData

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

                                                          $scope.showSummary = (event.summary.length > 0 || event.data.spent_by_impression || event.data.spent_by_interaction || event.data.spent_by_sample || customData.length > 0 || hasProgressBarData)
                                                          $scope.showEthnicity = showEthnicity
                                                          $scope.showAge = showAge
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
