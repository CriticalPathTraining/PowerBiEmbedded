using System;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.Rest;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using Microsoft.PowerBI.Api.V2.Models;

namespace PowerBiEmbeddedScratchpad.Models {


  class PbiEmbeddedManager {

    #region "private implemntation details"

    private static string aadAuthorizationEndpoint = "https://login.windows.net/common/oauth2/authorize";
    private static string resourceUriPowerBi = "https://analysis.windows.net/powerbi/api";
    private static string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

    private static string clientId = ConfigurationManager.AppSettings["client-id"];
    private static string redirectUrl = ConfigurationManager.AppSettings["reply-url"];

    private static string workspaceId = ConfigurationManager.AppSettings["app-workspace-id"];
    private static string datasetId = ConfigurationManager.AppSettings["dataset-id"];
    private static string reportId = ConfigurationManager.AppSettings["report-id"];
    private static string dashboardId = ConfigurationManager.AppSettings["dashboard-id"];

    private static string datasetWithRlsId = ConfigurationManager.AppSettings["rls-dataset-id"];
    private static string reportWithRlsId = ConfigurationManager.AppSettings["rls-report-id"];

    private static string GetAccessToken2() {

      string userName = "";
      string userPassword = "";

      // create new authentication context 
      AuthenticationContext authenticationContext = new AuthenticationContext(aadAuthorizationEndpoint);
      AuthenticationResult userAuthnResult;

      if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(userPassword)) {
        // use authentication context to trigger user sign-in and return access token 
        userAuthnResult = authenticationContext.AcquireTokenAsync(
                                                  resourceUriPowerBi,
                                                  clientId,
                                                  new Uri(redirectUrl),
                                                  new PlatformParameters(PromptBehavior.Auto)).Result;
      }
      else {
        userAuthnResult = authenticationContext.AcquireTokenAsync(
                                                  resourceUriPowerBi,
                                                  clientId,
                                                  new UserPasswordCredential(userName, userPassword)).Result;
      }

      // return access token to caller
      return userAuthnResult.AccessToken;
    }



    private static string GetAccessToken() {

      string userName = ConfigurationManager.AppSettings["aad-account-name"];
      string userPassword = ConfigurationManager.AppSettings["aad-account-password"];

      // create new authentication context 
      AuthenticationContext authenticationContext = new AuthenticationContext(aadAuthorizationEndpoint);
      AuthenticationResult userAuthnResult;

      if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(userPassword)) {
        // use authentication context to trigger user sign-in and return access token 
        userAuthnResult = authenticationContext.AcquireTokenAsync(
                                                  resourceUriPowerBi,
                                                  clientId,
                                                  new Uri(redirectUrl),
                                                  new PlatformParameters(PromptBehavior.Auto)).Result;
      }
      else {
        userAuthnResult = authenticationContext.AcquireTokenAsync(
                                                  resourceUriPowerBi,
                                                  clientId,
                                                  new UserPasswordCredential(userName, userPassword)).Result;
      }

      // return access token to caller
      return userAuthnResult.AccessToken;
    }

    private static PowerBIClient GetPowerBiClient() {
      var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
    }

    #endregion

    public static ReportEmbeddingData GetReportEmbeddingDataFirstParty() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var report = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);
      var embedUrl = report.EmbedUrl;
      var reportName = report.Name;
      var accessToken = GetAccessToken();

      return new ReportEmbeddingData {
        reportId = reportId,
        reportName = reportName,
        embedUrl = embedUrl,
        accessToken = accessToken
      };

    }

    public static ReportEmbeddingData GetReportEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var report = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);
      var embedUrl = report.EmbedUrl;
      var reportName = report.Name;

      // create token request object
      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");

      // call to Power BI Service API and pass GenerateTokenRequest object to generate embed token
      string embedToken = pbiClient.Reports.GenerateTokenInGroup(workspaceId,
                                                                 report.Id,
                                                                 generateTokenRequestParameters).Token;

      return new ReportEmbeddingData {
        reportId = reportId,
        reportName = reportName,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static DashboardEmbeddingData GetDashboardEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var dashboard = pbiClient.Dashboards.GetDashboardInGroup(workspaceId, dashboardId);
      var embedUrl = dashboard.EmbedUrl;
      var dashboardDisplayName = dashboard.DisplayName;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
      string embedToken = pbiClient.Dashboards.GenerateTokenInGroup(workspaceId, 
                                                                    dashboardId, 
                                                                    generateTokenRequestParameters).Token;

      return new DashboardEmbeddingData {
        dashboardId = dashboardId,
        dashboardName = dashboardDisplayName,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static DashboardTileEmbeddingData GetDashboardTileEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var tiles = pbiClient.Dashboards.GetTilesInGroup(workspaceId, dashboardId).Value;

      // retrieve first tile in tiles connection
      var tile = tiles[0]; 
      var tileId = tile.Id;
      var tileTitle = tile.Title;
      var embedUrl = tile.EmbedUrl;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
      string embedToken = pbiClient.Tiles.GenerateTokenInGroup(workspaceId, 
                                                               dashboardId, 
                                                               tileId, 
                                                               generateTokenRequestParameters).Token;

      return new DashboardTileEmbeddingData {
        dashboardId = dashboardId,
        TileId = tileId,
        TileTitle = tileTitle,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static NewReportEmbeddingData GetNewReportEmbeddingData() {

      string embedUrl = "https://app.powerbi.com/reportEmbed?groupId=" + workspaceId;

      PowerBIClient pbiClient = GetPowerBiClient();

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "create", 
                                                                                     datasetId: datasetId);

      string embedToken = pbiClient.Reports.GenerateTokenForCreateInGroup(workspaceId, 
                                                                          generateTokenRequestParameters).Token;

      return new NewReportEmbeddingData {
        workspaceId = workspaceId,
        datasetId = datasetId,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static NewReportEmbeddingData GetNewReportEmbeddingDataFirstParty() {

      string embedUrl = "https://app.powerbi.com/reportEmbed?groupId=" + workspaceId;

      return new NewReportEmbeddingData {
        workspaceId = workspaceId,
        datasetId = datasetId,
        embedUrl = embedUrl,
        accessToken = GetAccessToken()
      };

    }

    public static QnaEmbeddingData GetQnaEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var dataset = pbiClient.Datasets.GetDatasetByIdInGroup(workspaceId, datasetId);

      string embedUrl = "https://app.powerbi.com/qnaEmbed?groupId=" + workspaceId;
      string datasetID = dataset.Id;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");

      string embedToken = pbiClient.Datasets.GenerateTokenInGroup(workspaceId, 
                                                                  dataset.Id, 
                                                                  generateTokenRequestParameters).Token;

      return new QnaEmbeddingData {
        datasetId = datasetId,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }
  

  }
}
