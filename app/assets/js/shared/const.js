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
    surveys_question_gender: {
    	MALE: 10,
    	FEMALE: 9
    },
    surveys_question_race: {
    	ASIAN: 11,
    	BLACK: 12,
    	LATINO: 13,
    	AMERICAN: 14,
    	WHITE: 15
    },
    surveys_question_age: {
    	LESS12: 1,
    	BETWEEN_12_17: 2,
    	BETWEEN_18_20: 387,
    	BETWEEN_21_24: 3,
    	BETWEEN_25_34: 4,
    	BETWEEN_35_44: 5,
    	BETWEEN_45_54: 6,
    	BETWEEN_55_64: 7,
    	MORE_65: 8
    },
    surveys_question_likelihood: {
        VERY_UNLIKELY: 1,
        UNLIKELY: 2,
        REGULAR: 3,
        LIKELY: 4,
        VERY_LIKELY: 5
    },
    question_one_options: {
        PURCHASED: "purchased",
        AWARE: "aware",
        UNAWARE: "unaware"
    }
});

// All inner objects of it are now also immutable after app load
angular.forEach(scopic.consts, function (c) {
    c = Object.freeze(c);
});
