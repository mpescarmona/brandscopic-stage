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
    },
    booleans: {
        TRUE: true,
        FALSE: false
    },
    events_typeahead_categories: {
        CAMPAIGNS: "Campaigns",
        BRANDS: "Brands",
        PLACES: "Places",
        USERS: "Users"
    }
});

// All inner objects of it are now also immutable after app load
angular.forEach(scopic.consts, function (c) {
    c = Object.freeze(c);
});
