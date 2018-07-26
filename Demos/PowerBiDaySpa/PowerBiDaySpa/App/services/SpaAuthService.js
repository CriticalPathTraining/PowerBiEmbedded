var myApp;
(function (myApp) {
    var SpaAuthService = /** @class */ (function () {
        function SpaAuthService() {
        }
        // replace this client id with your client id
        SpaAuthService.client_id = "YOUR_CLIENT_ID_HERE";
        SpaAuthService.powerBiApiResourceId = "https://analysis.windows.net/powerbi/api";
        SpaAuthService.userName = "";
        SpaAuthService.userIsAuthenticated = false;
        SpaAuthService.init = function () {
            var config = {
                tenant: "common",
                clientId: SpaAuthService.client_id,
                redirectUri: window.location.origin,
                cacheLocation: "sessionStorage",
                postLogoutRedirectUri: window.location.origin,
                endpoints: { "https://api.powerbi.com/v1.0/": "https://analysis.windows.net/powerbi/api" }
            };
            SpaAuthService.authContext = new AuthenticationContext(config);
            var isCallback = SpaAuthService.authContext.isCallback(window.location.hash);
            SpaAuthService.authContext.handleWindowCallback();
            if (isCallback && !SpaAuthService.authContext.getLoginError()) {
                var loginRequest = SpaAuthService.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST;
                console.log("3", loginRequest);
                window.location.href = SpaAuthService.authContext._getItem(loginRequest);
            }
            var user = SpaAuthService.authContext.getCachedUser();
            if (user) {
                SpaAuthService.authContext.acquireToken(SpaAuthService.powerBiApiResourceId, function (error, token) {
                    if (error || !token) {
                        // TODO: Handle error obtaining access token
                        alert('ERROR:\n\n' + error);
                        return;
                    }
                    console.log("Access token acquired");
                    SpaAuthService.accessToken = token;
                    SpaAuthService.userIsAuthenticated = true;
                    SpaAuthService.userName = user.profile["name"];
                    if (SpaAuthService.uiUpdateCallback) {
                        SpaAuthService.uiUpdateCallback();
                    }
                });
            }
        };
        SpaAuthService.login = function () {
            SpaAuthService.authContext.login();
        };
        SpaAuthService.logout = function () {
            SpaAuthService.authContext.logOut();
            SpaAuthService.authContext.clearCache();
            SpaAuthService.userName = "";
            SpaAuthService.accessToken = "";
        };
        return SpaAuthService;
    }());
    myApp.SpaAuthService = SpaAuthService;
    // call init to act like static constructor
    SpaAuthService.init();
})(myApp || (myApp = {}));
//# sourceMappingURL=SpaAuthService.js.map