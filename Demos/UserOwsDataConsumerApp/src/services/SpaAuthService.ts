import * as Msal from 'msal';
import AppSettings from "./../AppSettings";

export default class SpaAuthService {

    private static clientId: string = AppSettings.clientId;
    private static authority: string = "https://login.microsoftonline.com/" + AppSettings.aadTenant;

    private static requestScopesPowerBi = {
        scopes: [
            "https://analysis.windows.net/powerbi/api/Dashboard.Read.All",
            "https://analysis.windows.net/powerbi/api/Dataset.Read.All",
            "https://analysis.windows.net/powerbi/api/Report.Read.All",
            "https://analysis.windows.net/powerbi/api/Group.Read.All",
            "https://analysis.windows.net/powerbi/api/Workspace.ReadWrite.All"          
        ]
    };

    public static userIsAuthenticated: boolean = false;
    public static userDisplayName: string = "";
    public static userName: string = "";
    public static accessToken: string;
    public static uiUpdateCallback: any;

    private static msalConfig: Msal.Configuration = {
        auth: {
            clientId: SpaAuthService.clientId,
            authority: SpaAuthService.authority
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
        }
    };

    private static userAgent: Msal.UserAgentApplication = new Msal.UserAgentApplication(SpaAuthService.msalConfig);

    private static requiresInteraction(errorCode: any) {
        if (!errorCode || !errorCode.length) {
            return false;
        }
        return errorCode === "consent_required" ||
            errorCode === "interaction_required" ||
            errorCode === "login_required";
    }

    private static acquireAccessoken(){
        SpaAuthService.userAgent.acquireTokenSilent(SpaAuthService.requestScopesPowerBi)
        .then(function (tokenResponse) {
            console.log("Access token acquired silently...");                        
            SpaAuthService.accessToken = tokenResponse.accessToken;
            console.log("Call UI callback");
            SpaAuthService.uiUpdateCallback();
        }).catch(function (error) {
            console.log(error);
            if (SpaAuthService.requiresInteraction(error.errorCode)) {
                SpaAuthService.userAgent.acquireTokenPopup(SpaAuthService.requestScopesPowerBi).then((tokenResponse) => {
                    console.log("Access token acquired interactively...");
                    console.log(tokenResponse);
                }).catch(function (error) {
                    console.log("Error all the way down the line");
                    console.log(error);
                });
            }
        });

    }

    static init = () => {

        let userAccount = SpaAuthService.userAgent.getAccount();

        if (userAccount) {
            console.log("User account info retrieved...")
            SpaAuthService.userName = userAccount.userName;
            SpaAuthService.userDisplayName = userAccount.name;
            SpaAuthService.userIsAuthenticated = true;
            console.log("Acquiring access token...")
            SpaAuthService.acquireAccessoken();   
        }


        SpaAuthService.userAgent.handleRedirectCallback((error: Msal.AuthError, response: Msal.AuthResponse) => {
            console.log("Redirect callback executing...");
            if (error) {
                console.log("Error during auth callback...");
                console.log(error);
            }
            else {
                if (response.tokenType === "access_token") {
                    console.log("Access token acquired...");
                    SpaAuthService.accessToken = response.accessToken;
                    SpaAuthService.userDisplayName = response.account.name;
                    SpaAuthService.userName = response.account.userName;
                    SpaAuthService.userIsAuthenticated = true;
                    if (SpaAuthService.uiUpdateCallback != undefined) {
                        SpaAuthService.uiUpdateCallback();
                    }
                } else {
                    console.log("token type is:" + response.tokenType);
                }
            }
        });


    }

    static login = () => {

        SpaAuthService.userAgent.loginPopup(SpaAuthService.requestScopesPowerBi)
            .then((loginResponse: any) => {
                console.log("login success...");
                var account = SpaAuthService.userAgent.getAccount();
                SpaAuthService.userName = loginResponse.account.userName;
                SpaAuthService.userDisplayName = loginResponse.account.name;                
                SpaAuthService.userIsAuthenticated = true;
                SpaAuthService.uiUpdateCallback();
                SpaAuthService.acquireAccessoken();
            }).catch(function (error: any) {
                console.log("log in error...");
                console.log(error);
            });

        if (SpaAuthService.uiUpdateCallback) {
            SpaAuthService.uiUpdateCallback();
        }

    }

    static logout = () => {
        SpaAuthService.userIsAuthenticated = false;
        SpaAuthService.userAgent.logout();
    }

}
