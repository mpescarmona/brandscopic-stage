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
                          scope.$broadcast("RESULT_SEARCH", { id: ui.item.id, type: ui.item.type });
                          scope.searchEvent = ui.item.value;
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

    }])

    .directive('scopicAutoExpand', function () {
        return {
            restrict: 'A',
            link: function( $scope, elem, attrs) {
                  var textSummary,
                      wordsCount;

                  $scope.$watch("event.summary", function (value) {
                    if(value != null) {
                      textSummary = value.split(" ");
                      wordsCount = textSummary.length;     
                    }
                    if(wordsCount > 100) {
                      $scope.showMoreTextLink = true;
                    } else {
                      $scope.showMoreTextLink = false;
                    }
                });

                $scope.$watch("isActive", function (value) {
                    if (value && $scope.isMore) {
                          var height = elem[0].scrollHeight;

                          elem.height(height);

                      elem.bind('keyup', function($event) {
                          var element = $event.target;

                          elem.height(0);
                          var height = elem[0].scrollHeight;

                          elem.height(height);
                      });
                  } else {
                    elem.unbind('keyup');
                    elem.height(50);
                  }
              });
            }
        };

    });
