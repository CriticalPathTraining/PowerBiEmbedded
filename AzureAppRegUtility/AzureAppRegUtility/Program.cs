using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Azure.ActiveDirectory.GraphClient;

namespace AzureAppRegUtility {

  class Program {

    // update these 4 constants to run this application
    // client ID musr reference native app in azure AD with Azure AD permissions
    const string clientID = "YOUR_CLIENT_ID";
    const string tenantDomain =  "YOUR_DOMAIN.onMicrosoft.com";
    const string userName = "YOUR_USERNAME@YOUR_DOMAIN.onmicrosoft.com";
    const string userPassword = "YOUR_PASSWORD";

    #region "Azure AD Authentication Code"

    const string urlAzureGraphApi = "https://graph.windows.net/";


    protected static async Task<string> GetAccessToken() {
      string authority = "https://login.microsoftonline.com/common";
      var authenticationContext = new AuthenticationContext(authority);
      var creds = new UserPasswordCredential(userName, userPassword);

      var userAuthResult =
        await authenticationContext.AcquireTokenAsync(urlAzureGraphApi, clientID, creds);

      return userAuthResult.AccessToken;
    }

    private static ActiveDirectoryClient adClient {
      get {
        return new ActiveDirectoryClient(
          new Uri(urlAzureGraphApi + tenantDomain),
          async () => { return await GetAccessToken(); }
          );
      }
    }

    #endregion

    static void Main(string[] args) {
      CreateApplicationForPowerBI("My Power BI Embedded App");
    }
 
    static void CreateApplicationForPowerBI(string AppDisplayName) {

      Console.WriteLine("Creating new Azure AD app named " + AppDisplayName);

      Application newApplication = new Application {
        DisplayName = AppDisplayName,
        PublicClient = true
      };

      // add a unique reply URL 
      newApplication.ReplyUrls.Add("https://localhost/" + Guid.NewGuid().ToString());

      // add permissions for AAD
      newApplication.RequiredResourceAccess.Add(
        new RequiredResourceAccess {
          ResourceAppId = "00000002-0000-0000-c000-000000000000",
          ResourceAccess = new List<ResourceAccess>() {
            new ResourceAccess {Type="Scope", Id=new Guid("a42657d6-7f20-40e3-b6f0-cee03008a62a")}
          }
        });

      // add permissions for Power BI REST API
      newApplication.RequiredResourceAccess.Add(
        new RequiredResourceAccess {
          ResourceAppId = "00000009-0000-0000-c000-000000000000",
          ResourceAccess = new List<ResourceAccess>() {
            new ResourceAccess {Type="Scope", Id=new Guid("7504609f-c495-4c64-8542-686125a5a36f")},
            new ResourceAccess {Type="Scope", Id=new Guid("a65a6bd9-0978-46d6-a261-36b3e6fdd32e")},
            new ResourceAccess {Type="Scope", Id=new Guid("47df08d3-85e6-4bd3-8c77-680fbe28162e")},
            new ResourceAccess {Type="Scope", Id=new Guid("4ae1bf56-f562-4747-b7bc-2fa0874ed46f")},
            new ResourceAccess {Type="Scope", Id=new Guid("f3076109-ca66-412a-be10-d4ee1be95d47")},
            new ResourceAccess {Type="Scope", Id=new Guid("ecf4e395-4315-4efa-ba57-a253fe0438b4")},
            new ResourceAccess {Type="Scope", Id=new Guid("322b68b2-0804-416e-86a5-d772c567b6e6")},
            new ResourceAccess {Type="Scope", Id=new Guid("7f33e027-4039-419b-938e-2f8ca153e68e")},
            new ResourceAccess {Type="Scope", Id=new Guid("2448370f-f988-42cd-909c-6528efd67c1a")},
            new ResourceAccess {Type="Scope", Id=new Guid("ecc85717-98b0-4465-af6d-1cbba6f9c961")}
          }
        });

      // register the application with AAD
      adClient.Applications.AddApplicationAsync(newApplication).Wait();

      // now you can retireve the client ID of the new app
      Console.WriteLine("App created with client id of " + newApplication.AppId);

      // create service principal for application in current tenancy
      ServicePrincipal newServicePrincpal = new ServicePrincipal {
        AppId = newApplication.AppId,
        DisplayName = newApplication.DisplayName,
        AccountEnabled = true
      };

      adClient.ServicePrincipals.AddServicePrincipalAsync(newServicePrincpal).Wait();

      Console.WriteLine("New service principal created with ID : " + newServicePrincpal.ObjectId);


      // add perm grants for Azure AD
      adClient.Oauth2PermissionGrants.AddOAuth2PermissionGrantAsync(
        new OAuth2PermissionGrant {
          ClientId = newServicePrincpal.ObjectId,
          ConsentType = "Principal",
          PrincipalId = GetCurrentUserId(),
          ResourceId = GetServicePrincipalId("Windows Azure Active Directory"),
          Scope = "User.Read Directory.AccessAsUser.All",
          ExpiryTime = DateTime.Now.AddYears(1),
          StartTime = DateTime.Now
        }).Wait();


      // add perm grants for Power BI
      adClient.Oauth2PermissionGrants.AddOAuth2PermissionGrantAsync(
        new OAuth2PermissionGrant {
          ClientId = newServicePrincpal.ObjectId,
          ConsentType = "Principal",
          PrincipalId = GetCurrentUserId(),
          ResourceId = GetServicePrincipalId("Power BI Service"),
          Scope = "Dataset.ReadWrite.All Dashboard.Read.All Report.Read.All Group.Read Group.Read.All Content.Create Metadata.View_Any Dataset.Read.All Data.Alter_Any",
          ExpiryTime = DateTime.Now.AddYears(1),
          StartTime = DateTime.Now
        }).Wait();

    }

    static string GetCurrentUserId() {
      var currentUser = adClient.Users.Where(u => u.UserPrincipalName.Equals(userName)).ExecuteSingleAsync().Result;
      return currentUser.ObjectId;
    }

    static string GetServicePrincipalId(string DisplayName) {
      var servicePrincipal = adClient.ServicePrincipals.Where(sp => sp.DisplayName.Equals(DisplayName)).ExecuteSingleAsync().Result;
      return servicePrincipal.ObjectId;
      }

  }
}
