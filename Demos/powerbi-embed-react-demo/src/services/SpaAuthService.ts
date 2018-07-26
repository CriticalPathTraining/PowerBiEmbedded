var AuthenticationContext = require('expose-loader?AuthenticationContext!adal-angular');

export default class SpaAuthService {

  // replace this client id with your client id
  //  update this Client ID with the ID for an app you have registered with Azure AD
  private static client_id: string = "";
  private static powerBiApiResourceId: string = "https://analysis.windows.net/powerbi/api";

  private static authContext: any;
  public static userName: string = "";
  public static userIsAuthenticated: boolean = false;
  public static accessToken: string;
  public static uiUpdateCallback: any;

  static init = () => {

    var config: any = {
      tenant: "common",
      clientId: SpaAuthService.client_id,
      redirectUri: window.location.origin,
      cacheLocation: "sessionStorage",
      postLogoutRedirectUri: window.location.origin,
      endpoints: { "https://api.powerbi.com/v1.0/": "https://analysis.windows.net/powerbi/api" }
    }

    SpaAuthService.authContext = new AuthenticationContext(config);
    var isCallback = SpaAuthService.authContext.isCallback(window.location.hash);
    SpaAuthService.authContext.handleWindowCallback();

    if (isCallback && !SpaAuthService.authContext.getLoginError()) {
      var loginRequest = SpaAuthService.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST;
      window.location.href = SpaAuthService.authContext._getItem(loginRequest);
    }

    var user = SpaAuthService.authContext.getCachedUser();
    if (user) {
      SpaAuthService.authContext.acquireToken(SpaAuthService.powerBiApiResourceId,
        function (error: any, token: any) {
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

  }

  static login = () => {
    SpaAuthService.authContext.login();
  }

  static logout = () => {
    SpaAuthService.authContext.logOut();
    SpaAuthService.authContext.clearCache();
    SpaAuthService.userName = "";
    SpaAuthService.accessToken = "";
  }

}

// call init to act like static constructor
SpaAuthService.init();