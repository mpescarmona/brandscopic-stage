angular.module('brandscopicApp.sharedDirectives', [])
    .directive('scopicTypeahead', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService) {
        "use strict";

        var link = function (scope, element, attrs) {

            var searchResult = []
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
                          response(data);
                      })
                    },
              select: function(event, ui) {
                      scope.$broadcast("FILTER_EVENTS", { id: ui.item.id, type: ui.item.category });
                      return false;
                    }
            });
        };

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'views/directives/templates/typeahead.html'
        };

    }]);
