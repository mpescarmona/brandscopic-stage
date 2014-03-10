function VenuesAnalysisController($scope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui = {title: venue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "analysis"}
                                $scope.venue = venue
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface

                                var
                                    credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: venue.id }
                                  , actions = { success: function(analysis) {
                                                            $scope.analysis = analysis

                                                            var dataAgeCategories = []
                                                              , dataAgeSource = []
                                                              , gapAgeValue = []
                                                              , progressBarData = []
                                                              , ethnicData = []
                                                              , impressionsPromo = []
                                                              , impressionsCost = []
                                                              , male = 0
                                                              , female = 0

                                                            // Get Age values
                                                            for (var key in analysis.age) {
                                                              dataAgeCategories.push(key)
                                                              dataAgeSource.push((analysis.age[key]) ? analysis.age[key] : 0)
                                                              gapAgeValue.push(100 - ((analysis.age[key]) ? analysis.age[key] : 0))
                                                            }
                                                            // Get Ethnicity values
                                                            for (var key in analysis.ethnicity) {
                                                              item = []
                                                              item.push(key)
                                                              item.push(((analysis.ethnicity[key]) ? analysis.ethnicity[key] : 0))
                                                              ethnicData.push(item)
                                                            }
                                                            // Get Impressions Promo values
                                                            for (var key in analysis.trends_by_week.impressions_promo) {
                                                              impressionsPromo.push(((analysis.trends_by_week.impressions_promo[key]) ? analysis.trends_by_week.impressions_promo[key] : 0))
                                                            }
                                                            // Get Impressions Promo values
                                                            for (var key in analysis.trends_by_week.cost_impression) {
                                                              impressionsCost.push(((analysis.trends_by_week.cost_impression[key]) ? analysis.trends_by_week.cost_impression[key] : 0))
                                                            }

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

                                                          $scope.trendsChart = {
                                                                            options: {
                                                                              legend: { enabled: false },
                                                                              tooltip: { enabled: false }
                                                                            },
                                                                            title: { text: "" },
                                                                            subtitle: { text: "" },
                                                                            xAxis: { categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] },
                                                                            yAxis: [  { 
                                                                                        id: 0,
                                                                                        title: {enabled: false }
                                                                                      }
                                                                                    , {
                                                                                        id: 1,
                                                                                        title: {enabled: false },
                                                                                        opposite: true
                                                                                      }
                                                                                   ],
                                                                            legend: { enabled: true },
                                                                            series: [
                                                                                      {
                                                                                        name: 'Impressions/promo hour',
                                                                                        type: 'line',
                                                                                        yAxis: 0,
                                                                                        data: impressionsPromo,
                                                                                        labels: { enabled: false }

                                                                                      } ,
                                                                                      {
                                                                                        name: 'Cost/Impression',
                                                                                        type: 'line',
                                                                                        yAxis: 1,
                                                                                        data: impressionsCost,
                                                                                        labels: { enabled: false }

                                                                                      }
                                                                                    ],
                                                                            credits: { enabled: false },
                                                                            loading: false
                                                      }
                                              }
                                    }
                                Venue.analysis(credentials, actions)
                             }
        }

    Venue.find(credentials, actions)
}

VenuesAnalysisController.$inject = [  '$scope'
                                    , '$state'
                                    , '$stateParams'
                                    , 'snapRemote'
                                    , 'CompanyService'
                                    , 'UserService'
                                    , 'UserInterface'
                                    , 'Venue'
                                   ]
