using System;
using System.Configuration;
using System.Threading.Tasks;
using Microsoft.Rest;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Identity.Client;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web;
using System.Security.Cryptography.X509Certificates;

namespace ThirdPartyEmbeddingDemo.Models {

  public class PbiEmbeddedManager {

    private static readonly string clientId = ConfigurationManager.AppSettings["client-id"];
    private static readonly string clientSecret = ConfigurationManager.AppSettings["client-secret"];
    private static readonly string tenantName = ConfigurationManager.AppSettings["tenant-name"];

    private static readonly string workspaceId = ConfigurationManager.AppSettings["app-workspace-id"];
    private static readonly string datasetId = ConfigurationManager.AppSettings["dataset-id"];
    private static readonly string reportId = ConfigurationManager.AppSettings["report-id"];
    private static readonly string dashboardId = ConfigurationManager.AppSettings["dashboard-id"];

    // endpoint for tenant-specific authority 
    private static readonly string tenantAuthority = "https://login.microsoftonline.com/" + tenantName;

    // Power BI Service API Root URL
    const string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

    static string GetAccessToken() {

      var appConfidential = ConfidentialClientApplicationBuilder.Create(clientId)
                              .WithClientSecret(clientSecret)
                              .WithAuthority(tenantAuthority)
                              .Build();

      string[] scopesDefault = new string[] { "https://analysis.windows.net/powerbi/api/.default" };
      var authResult = appConfidential.AcquireTokenForClient(scopesDefault).ExecuteAsync().Result;
      return authResult.AccessToken;
    }


    private static PowerBIClient GetPowerBiClient() {
      var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
    }

    public static async Task<ReportEmbeddingData> GetReportEmbeddingData() {

      string currentUserName = HttpContext.Current.User.Identity.GetUserName();
      ApplicationDbContext context = new ApplicationDbContext();
      var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
      ApplicationUser currentUser = userManager.FindByName(currentUserName);

      var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

      List<string> roles = new List<string>();

      foreach (var role in currentUser.Roles) {
        roles.Add(roleManager.FindById(role.RoleId).Name);
      }

      string accessLevel = HttpContext.Current.User.IsInRole("Admin") ? "edit" : "view";

      PowerBIClient pbiClient = GetPowerBiClient();

      var report = await pbiClient.Reports.GetReportInGroupAsync(workspaceId, reportId);
      var embedUrl = report.EmbedUrl;
      var reportName = report.Name;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: accessLevel);
      string embedToken =
            (await pbiClient.Reports.GenerateTokenInGroupAsync(workspaceId,
                                                               report.Id,
                                                               generateTokenRequestParameters)).Token;

      return new ReportEmbeddingData {
        reportId = reportId,
        reportName = reportName,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

  }

}