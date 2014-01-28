/**
 * #######################################
 * ### ENUM Constants ###
 * #######################################
 */

var scopic = {};
scopic.consts = Object.freeze({
    typeahead_types: {
        PLACES: 'PLACES',
        EVENTS: 'EVENTS'
    }
});

// All inner objects of it are now also immutable after app load
angular.forEach(scopic.consts, function (c) {
    c = Object.freeze(c);
});
