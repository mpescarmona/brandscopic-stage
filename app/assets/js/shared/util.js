// Inject into the $rootScope the consts, This function is called when start the app on app.js
scopic.injectConst = function (scope) {
    "use strict";
    scope.scopic = {
        consts: scopic.consts
    };
};

function LoginData(authToken, email, currentCompanyId, currentCompanyName) {
    this.authToken = authToken;
    this.email = email;
    this.currentCompanyId = currentCompanyId;
    this.currentCompanyName = currentCompanyName;
}