angular.module('brandscopicApp.sharedDirectives', [])
    .directive('scopicTypeahead', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService) {
        "use strict";

        var link = function (scope, element, attrs) {
          
              /*var obj = {"page":1,"total":25,"facets":[{"label":"Campaigns","items":[{"label":"Jameson LOCALS","id":60,"name":"campaign","selected":false},{"label":"Kahlua MC FY14","id":56,"name":"campaign","selected":false},{"label":"TR Absolut Originality ","id":58,"name":"campaign","selected":false}]},{"label":"Brands","items":[{"label":"Jameson LOCALS","id":13,"name":"brand","selected":false}]},{"label":"Areas","items":[]},{"label":"People","items":[{"label":"Admin User","id":1,"name":"user","selected":false},{"label":"Chris Jaskot","id":70,"name":"user","selected":false},{"label":"Guillermo Vargas","id":314,"name":"user","selected":false},{"label":"Guillermo Vargas","id":3,"name":"user","selected":false},{"label":"Mario Pescarmona","id":353,"name":"user","selected":false},{"label":"Silvana Corvalan","id":351,"name":"user","selected":false},{"label":"Test User","id":2,"name":"user","selected":false}]},{"label":"Event Status","items":[{"label":"Approved","id":"Approved","name":"event_status","count":0,"selected":false},{"label":"Due","id":"Due","name":"event_status","count":1,"selected":false},{"label":"Late","id":"Late","name":"event_status","count":10,"selected":false},{"label":"Rejected","id":"Rejected","name":"event_status","count":0,"selected":false},{"label":"Submitted","id":"Submitted","name":"event_status","count":0,"selected":false}]},{"label":"Active State","items":[{"label":"Active","id":"Active","name":"status","count":16,"selected":false},{"label":"Inactive","id":"Inactive","name":"status","count":9,"selected":false}]}],"results":[{"id":11452,"start_date":"11/05/2013","start_time":"8:30 AM","end_date":"11/05/2013","end_time":"11:30 AM","status":"Inactive","event_status":"Late","campaign":{"id":58,"name":"TR Absolut Originality "},"place":{"id":3133,"name":"Timmy Nolan's Tavern and Grill","latitude":34.152344,"longitude":-118.351026,"formatted_address":"10111 Riverside Drive, Toluca Lake, CA, United States","country":"US","state":"California","state_name":"California","city":"Los Angeles","zipcode":"91602"}},{"id":11453,"start_date":"11/05/2013","start_time":"8:30 AM","end_date":"11/05/2013","end_time":"11:30 AM","status":"Inactive","event_status":"Late","campaign":{"id":56,"name":"Kahlua MC FY14"},"place":{"id":3143,"name":"Duffy's Tavern and Grille","latitude":41.93298,"longitude":-87.640323,"formatted_address":"420 West Diversey Parkway, Chicago, IL, United States","country":"US","state":"Illinois","state_name":"Illinois","city":"Chicago","zipcode":"60614"}},{"id":11450,"start_date":"11/05/2013","start_time":"8:30 AM","end_date":"11/05/2013","end_time":"11:30 AM","status":"Inactive","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":3133,"name":"Timmy Nolan's Tavern and Grill","latitude":34.152344,"longitude":-118.351026,"formatted_address":"10111 Riverside Drive, Toluca Lake, CA, United States","country":"US","state":"California","state_name":"California","city":"Los Angeles","zipcode":"91602"}},{"id":7351,"start_date":"11/19/2013","start_time":"2:30 AM","end_date":"11/19/2013","end_time":"4:14 PM","status":"Active","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":2289,"name":"Bar None","latitude":40.732367,"longitude":-73.988044,"formatted_address":"98 3rd Avenue, New York, NY, United States","country":"US","state":"New York","state_name":"New York","city":"New York","zipcode":"10003"}},{"id":11473,"start_date":"01/01/2014","start_time":"11:01 AM","end_date":"03/02/2014","end_time":"11:05 AM","status":"Inactive","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11465,"start_date":"01/06/2014","start_time":"11:52 PM","end_date":"01/21/2014","end_time":"1:52 AM","status":"Inactive","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11459,"start_date":"01/10/2014","start_time":"10:10 AM","end_date":"01/12/2014","end_time":"12:12 AM","status":"Inactive","event_status":"Late","campaign":{"id":56,"name":"Kahlua MC FY14"},"place":{"id":3143,"name":"Duffy's Tavern and Grille","latitude":41.93298,"longitude":-87.640323,"formatted_address":"420 West Diversey Parkway, Chicago, IL, United States","country":"US","state":"Illinois","state_name":"Illinois","city":"Chicago","zipcode":"60614"}},{"id":11462,"start_date":"01/12/2014","start_time":"10:10 AM","end_date":"01/17/2014","end_time":"12:30 PM","status":"Inactive","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11451,"start_date":"01/12/2014","start_time":"1:15 PM","end_date":"01/12/2014","end_time":"2:15 PM","status":"Inactive","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":3134,"name":"Duty Free America #727","latitude":25.7950665,"longitude":-80.2786931,"formatted_address":null,"country":"US","state":"Florida","state_name":"Florida","city":"Miami","zipcode":"33126"}},{"id":11461,"start_date":"01/15/2014","start_time":"10:10 AM","end_date":"01/20/2014","end_time":"12:30 AM","status":"Inactive","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11460,"start_date":"01/20/2014","start_time":"10:10 AM","end_date":"01/21/2014","end_time":"12:12 AM","status":"Active","event_status":"Late","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11463,"start_date":"01/31/2014","start_time":"12:00 AM","end_date":"02/12/2014","end_time":"12:00 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11470,"start_date":"02/01/2014","start_time":"11:11 AM","end_date":"04/01/2014","end_time":"12:55 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11469,"start_date":"02/01/2014","start_time":"12:12 PM","end_date":"03/01/2014","end_time":"12:04 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11484,"start_date":"02/05/2014","start_time":"8:59 AM","end_date":"02/08/2014","end_time":"8:03 AM","status":"Active","event_status":"Due","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":3139,"name":"Wando's","latitude":43.073307,"longitude":-89.395954,"formatted_address":"602 University Avenue, Madison, WI, United States","country":"US","state":"Wisconsin","state_name":"Wisconsin","city":"Madison","zipcode":"53715"}},{"id":11477,"start_date":"02/11/2014","start_time":"11:01 AM","end_date":"03/12/2014","end_time":"12:05 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11472,"start_date":"02/11/2014","start_time":"3:05 PM","end_date":"03/12/2014","end_time":"12:04 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11481,"start_date":"02/12/2014","start_time":"11:01 AM","end_date":"05/02/2014","end_time":"11:01 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11482,"start_date":"02/14/2014","start_time":"11:11 AM","end_date":"03/15/2014","end_time":"10:02 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":3134,"name":"Duty Free America #727","latitude":25.7950665,"longitude":-80.2786931,"formatted_address":null,"country":"US","state":"Florida","state_name":"Florida","city":"Miami","zipcode":"33126"}},{"id":11476,"start_date":"02/22/2014","start_time":"11:11 AM","end_date":"02/23/2014","end_time":"11:11 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11483,"start_date":"02/22/2014","start_time":"12:01 PM","end_date":"04/01/2014","end_time":"12:03 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":{"id":3138,"name":"Press Play","latitude":40.0149856,"longitude":-105.2705456,"formatted_address":"1005 Pearl St., Boulder, CO 80302","country":"US","state":"Colorado","state_name":"Colorado","city":"Boulder","zipcode":"80302"}},{"id":11480,"start_date":"10/10/2014","start_time":"11:11 AM","end_date":"11/11/2014","end_time":"11:11 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11471,"start_date":"11/11/2014","start_time":"11:01 AM","end_date":"11/12/2014","end_time":"11:01 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11475,"start_date":"11/11/2014","start_time":"11:11 AM","end_date":"02/12/2015","end_time":"11:01 AM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null},{"id":11479,"start_date":"11/11/2014","start_time":"12:01 PM","end_date":"12/12/2014","end_time":"12:01 PM","status":"Active","event_status":"Scheduled","campaign":{"id":60,"name":"Jameson LOCALS"},"place":null}]}
              scope.searchResult = [];
              angular.forEach(obj.facets, function (item) {
                  angular.forEach(item.items, function (subItem) {
                      scope.searchResult.push({ category: subItem.name, label: subItem.label, id: subItem.id });
                  });
              });*/

            	scope.searchModel = "";

              var _getEventSearch = function (value) {
                  var defer = $q.defer();
                  var 
                    credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
                  , actions = { 
                      success: function (items) {
                                      scope.searchResult = [];
                                      angular.forEach(items.facets, function (item) {
                                          angular.forEach(item.items, function (subItem) {
                                                  scope.searchResult.push({ category: subItem.name, label: subItem.label, id: subItem.id });
                                              });
                                          });
                                      defer.resolve(scope.searchResult)
                                }
                       , error: function (event_error) {
                                  scope.event_error = event_error
                                  defer.reject()
                          }
                      }

                  Event.search(credentials, actions)
                  return defer.promise;
              } 
            
            $.widget( "custom.catcomplete", $.ui.autocomplete, {
                  _renderMenu: function( ul, items ) {
                      var that = this,
                      currentCategory = "";
                      $.each( items, function( index, item ) {
                          if ( item.category != currentCategory ) {
                            ul.append( "<li class='ui-autocomplete-category'>" + "<a class='category'><strong>" + item.category + "</strong></a>" + "</li>" );
                            currentCategory = item.category;
                          }
                          that._renderItemData( ul, item );
                      });
                  }
            });

            $( "#searchEvent" ).catcomplete({
              delay: 0,
              source: function (request, response) {
                      eventService.getEventSearch(request.term).then( function (data) {
                          console.log(data);
                          response(data);
                      })
                  }
                });
    		    };

        return {
            link: link,
            restrict: 'E',
            scope: {
              sourceEvent: "="
            },
            templateUrl: 'views/directives/templates/typeahead.html'
        };
    }]);