using System;
using System.Configuration;
using System.Threading.Tasks;

using Microsoft.Rest;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace EmbeddedLab.Models {

  class PbiEmbeddedManager {

    #region "private implementation details"

    private static string aadAuthorizationEndpoint = "https://login.windows.net/common/oauth2/authorize";
    private static string resourceUriPowerBi = "https://analysis.windows.net/powerbi/api";
    private static string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

    private static string userName = ConfigurationManager.AppSettings["aad-account-name"];
    private static string userPassword = ConfigurationManager.AppSettings["aad-account-password"];

    private static string workspaceId = ConfigurationManager.AppSettings["app-workspace-id"];
    private static string datasetId = ConfigurationManager.AppSettings["dataset-id"];
    private static string reportId = ConfigurationManager.AppSettings["report-id"];
    private static string dashboardId = ConfigurationManager.AppSettings["dashboard-id"];

    private static string clientId = ConfigurationManager.AppSettings["client-id"];


    private static string GetAccessToken() {
      AuthenticationContext authenticationContext = new AuthenticationContext(aadAuthorizationEndpoint);
      AuthenticationResult userAuthnResult =
        authenticationContext.AcquireTokenAsync(
          resourceUriPowerBi,
          clientId,
          new UserPasswordCredential(userName, userPassword)).Result;
      return userAuthnResult.AccessToken;
    }

    private static PowerBIClient GetPowerBiClient() {
      var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
    }

    #endregion

    public static async Task<ReportEmbeddingData> GetReportEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var report = await pbiClient.Reports.GetReportInGroupAsync(workspaceId, reportId);
      var embedUrl = report.EmbedUrl;
      var reportName = report.Name;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "edit");
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

    public static async Task<DashboardEmbeddingData> GetDashboardEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var dashboard = await pbiClient.Dashboards.GetDashboardInGroupAsync(workspaceId, dashboardId);
      var embedUrl = dashboard.EmbedUrl;
      var dashboardDisplayName = dashboard.DisplayName;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
      string embedToken = (await pbiClient.Dashboards.GenerateTokenInGroupAsync(workspaceId, dashboardId, generateTokenRequestParameters)).Token;

      return new DashboardEmbeddingData {
        dashboardId = dashboardId,
        dashboardName = dashboardDisplayName,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public async static Task<QnaEmbeddingData> GetQnaEmbeddingData() {

      PowerBIClient pbiClient = GetPowerBiClient();

      var dataset = await pbiClient.Datasets.GetDatasetByIdInGroupAsync(workspaceId, datasetId);

      string embedUrl = "https://app.powerbi.com/qnaEmbed?groupId=" + workspaceId;
      string datasetID = dataset.Id;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
      string embedToken =
             (await pbiClient.Datasets.GenerateTokenInGroupAsync(workspaceId,
                                                                 dataset.Id,
                                                                 generateTokenRequestParameters)).Token;

      return new QnaEmbeddingData {
        datasetId = datasetId,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static async Task<NewReportEmbeddingData> GetNewReportEmbeddingData() {

      string embedUrl = "https://app.powerbi.com/reportEmbed?groupId=" + workspaceId;

      PowerBIClient pbiClient = GetPowerBiClient();

      GenerateTokenRequest generateTokenRequestParameters =
                           new GenerateTokenRequest(accessLevel: "create", datasetId: datasetId);
      string embedToken =
        (await pbiClient.Reports.GenerateTokenForCreateInGroupAsync(workspaceId,
                                                                    generateTokenRequestParameters)).Token;

      return new NewReportEmbeddingData {
        workspaceId = workspaceId,
        datasetId = datasetId,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

    public static async Task<ReportEmbeddingData> GetEmbeddingDataForSpecificReport(string currentReportId) {

      PowerBIClient pbiClient = GetPowerBiClient();

      var report = await pbiClient.Reports.GetReportInGroupAsync(workspaceId, currentReportId);
      var embedUrl = report.EmbedUrl;
      var reportName = report.Name;

      GenerateTokenRequest generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "edit");
      string embedToken =
            (await pbiClient.Reports.GenerateTokenInGroupAsync(workspaceId,
                                                                currentReportId,
                                                                generateTokenRequestParameters)).Token;

      return new ReportEmbeddingData {
        reportId = currentReportId,
        reportName = reportName,
        embedUrl = embedUrl,
        accessToken = embedToken
      };

    }

  }
}