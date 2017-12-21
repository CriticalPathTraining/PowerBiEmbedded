using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace DailyReporterPro.Models {

  public class EmbedConfiguration {
    public string Id { get; set; }
    public string DatasetId { get; set; }
    public string EmbedUrl { get; set; }
    public EmbedToken EmbedToken { get; set; }
    public int MinutesToExpiration {
      get {
        var minutesToExpiration = EmbedToken.Expiration.Value - DateTime.UtcNow;
        return minutesToExpiration.Minutes;
      }
    }
    public string ErrorMessage { get; internal set; }
  }

  public class PbiEmbeddedManager {

    static string aadAuthorizationEndpoint = "https://login.windows.net/common/oauth2/authorize";
    static string resourceUriPowerBi = "https://analysis.windows.net/powerbi/api";
    static string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

    static string clientId = ConfigurationManager.AppSettings["clientId"];
    static string appWorkspaceId = ConfigurationManager.AppSettings["appWorkspaceId"];
    static string pbiUserName = ConfigurationManager.AppSettings["pbiUserName"];
    static string pbiUserPassword = ConfigurationManager.AppSettings["pbiUserPassword"];
  
    static string GetAccessToken() {
      AuthenticationContext authContext = new AuthenticationContext(aadAuthorizationEndpoint);
      var userCredentials = new UserPasswordCredential(pbiUserName, pbiUserPassword);
      return authContext.AcquireTokenAsync(resourceUriPowerBi, clientId, userCredentials).Result.AccessToken;
    }

    static PowerBIClient GetPowerBiClient() {
      var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
    }

    public static async Task<HomeViewModel> GetHomeView() {
      var client = GetPowerBiClient();
      var workspaces = (await client.Groups.GetGroupsAsync()).Value;
      var workspace = workspaces.Where(ws => ws.Id == appWorkspaceId).FirstOrDefault();
      var viewModel = new HomeViewModel {
        WorkspaceName = workspace.Name,
        WorkspaceId = workspace.Id
      };
      return viewModel;
    }

    public static async Task<DatasetsViewModel> GetDatasets() {
      var client = GetPowerBiClient();
      var workspaces = (await client.Groups.GetGroupsAsync()).Value;
      var datasets = (await client.Datasets.GetDatasetsInGroupAsync(appWorkspaceId)).Value;
      var workspace = workspaces.Where(ws => ws.Id == appWorkspaceId).FirstOrDefault();
      var viewModel = new DatasetsViewModel {
        Datasets = datasets.ToList()
      };
      return viewModel;
    }

    public static async Task<ReportsViewModel> GetReports(string reportId, string datasetId) {

      var client = GetPowerBiClient();
      var reports = (await client.Reports.GetReportsInGroupAsync(appWorkspaceId)).Value;
      var datasets = (await client.Datasets.GetDatasetsInGroupAsync(appWorkspaceId)).Value;

      var viewModel = new ReportsViewModel {
        Reports = reports.ToList(),
        Datasets = datasets.ToList()
      };

      viewModel.ReportMode = !string.IsNullOrEmpty(reportId) ? ReportMode.ExistingReport :
                             !string.IsNullOrEmpty(datasetId) ? ReportMode.NewReport :
                                                                ReportMode.NoReport;

      switch (viewModel.ReportMode) {
        case ReportMode.ExistingReport:
          Report report = reports.Where(r => r.Id == reportId).First();
          var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
          var token = client.Reports.GenerateTokenInGroupAsync(appWorkspaceId, report.Id, generateTokenRequestParameters).Result;
          // create embed info for existing report
          var embedConfig = new EmbedConfiguration() {
            EmbedToken = token,
            EmbedUrl = report.EmbedUrl,
            Id = report.Id
          };
          // add report data to view model
          viewModel.CurrentReport = new ReportViewModel {
            Report = report,
            EmbedConfig = embedConfig
          };
          break;

        case ReportMode.NewReport:
         var dataset = datasets.Where(ds => ds.Id == datasetId).First();
          var generateTokenRequestParametersForCreate = 
            new GenerateTokenRequest(datasetId: dataset.Id, accessLevel: "Create");
          var tokenForCreate = client.Reports.GenerateTokenForCreateInGroupAsync(appWorkspaceId, generateTokenRequestParametersForCreate).Result;
          // create embed info for existing report
          var embedConfigForCreate = new EmbedConfiguration() {
            DatasetId = datasetId,
            EmbedUrl = "https://app.powerbi.com/reportEmbed",
            EmbedToken = tokenForCreate
          };
          // add report data to view model
          viewModel.CurrentDataset = new DatasetViewModel {
            dataset = dataset,
            EmbedConfig = embedConfigForCreate
          };
          break;
      }
      return viewModel;
    }

    public static async Task<DashboardsViewModel> GetDashboards(string dashboardId) {

      var client = GetPowerBiClient();
      var dashboards = (await client.Dashboards.GetDashboardsInGroupAsync(appWorkspaceId)).Value;

      var viewModel = new DashboardsViewModel {
        Dashboards = dashboards.ToList()
      };

      if (!string.IsNullOrEmpty(dashboardId)) {
        Dashboard dashboard = dashboards.Where(d => d.Id == dashboardId).First();
        var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
        var token = client.Dashboards.GenerateTokenInGroupAsync(appWorkspaceId, dashboard.Id, generateTokenRequestParameters).Result;

        var embedConfig = new EmbedConfiguration() {
          EmbedToken = token,
          EmbedUrl = dashboard.EmbedUrl,
          Id = dashboard.Id
        };


        viewModel.CurrentDashboard = new DashboardViewModel {
          Dashboard = dashboard,
          EmbedConfig = embedConfig
        };

      }

      return viewModel;
    }


  }
}