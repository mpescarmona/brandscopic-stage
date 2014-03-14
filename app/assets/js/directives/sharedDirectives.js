angular.module('brandscopicApp.sharedDirectives', [])
    .directive('scopicTypeahead', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', 'venueService', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService, venueService) {
        "use strict";

        var link = function (scope, element, attrs) {
            function removeTagOnSelect(str) {
                return String(str).replace("<i>", '').replace("</i>", '');
            }

            var searchResult = []
            $.widget( "custom.catcomplete", $.ui.autocomplete, {
                  _renderMenu: function( ul, items ) {
                      var that = this,
                      currentCategory = "";
                      $.each( items, function( index, item ) {
                          if ( item.category && item.category != currentCategory ) {
                            ul.append( "<li class='ui-autocomplete-category'>" + "<span class='category'><strong>" + item.category + "</strong></span>" + "</li>" );
                            currentCategory = item.category;
                          }
                          that._renderItemData( ul, item );
                      });
                  }
            });

            $( "#searchEvent" ).catcomplete({
              delay: 0,
              source: function (request, response) {
                      if(attrs.source == "events") {
                          eventService.getEventSearch(request.term).then( function (data) {
                              response(data);
                          })
                      }
                      if(attrs.source == "venues") {
                          venueService.getVenuesAutocomplete(request.term).then( function (data) {
                              response(data);
                          })
                      }
                    },
              focus: function(event, ui) {
                      if(ui.item == undefined ) {
                          return false;
                      } else {
                        if(attrs.source == "events") {
                          ui.item.value = removeTagOnSelect(ui.item.value);
                        } else {
                          ui.item.value = removeTagOnSelect(ui.item.label);
                        }
                      }
                    },
              select: function(event, ui) {
                      if(ui.item != null && ui.item != undefined) {
                          if(attrs.source == "events") {
                            scope.$broadcast("RESULT_SEARCH", { id: ui.item.id, type: ui.item.category });
                          } else {
                            scope.$broadcast("RESULT_SEARCH", { id: ui.item.value, type: ui.item.type });
                          }
                      }
                      return false;
                    }
            }).data("custom-catcomplete")._renderItem = function(ul, item) {
                return $("<li></li>").data("ui-autocomplete-item", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
        };

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'views/directives/templates/typeahead.html'
        };

    }]);
