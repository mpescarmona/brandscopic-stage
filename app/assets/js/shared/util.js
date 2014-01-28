// Inject into the $rootScope the consts, This function is called when start the app on app.js
scopic.injectConst = function (scope) {
    "use strict";
    scope.scopic = {
        consts: scopic.consts
    };
};