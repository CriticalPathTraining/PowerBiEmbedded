using System;
using System.IO;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;

using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;

class Program {
  static string aadAuthorizationEndpoint = "https://login.windows.net/common/oauth2/authorize";
  static string resourceUriPowerBi = "https://analysis.windows.net/powerbi/api";
  static string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

  static string clientId = "ID_OF_AZURE_APPLICATION";
  static string redirectUrl = "REPLY_URL_OF_AZURE_APPLICATION";

  static string GetAccessToken() {

    // create new authentication context 
    var authenticationContext =
      new AuthenticationContext(aadAuthorizationEndpoint);

    // use authentication context to trigger user sign-in and return access token 
    var userAuthnResult =
      authenticationContext.AcquireTokenAsync(resourceUriPowerBi,
                                              clientId,
                                              new Uri(redirectUrl),
                                              new PlatformParameters(PromptBehavior.Auto)).Result;

    //var userAuthnResult =
    // authenticationContext.AcquireTokenAsync(resourceUriPowerBi,
    //                                         clientId,
    //                                         new UserPasswordCredential("ACCOUNT_NAME_OF_MASTER_USER", 
    //                                                                    "PASSWORD_OF_MASTER_USER")).Result;



    // return access token to caller
    return userAuthnResult.AccessToken;

  }

  static PowerBIClient GetPowerBiClient() {
    var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
    return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
  }

  static void Main() {

    //DisplayPersonalWorkspaceAssets();

    CloneAppWorkspace("Workspace Template", "Customer A");
    //ClonePersonalWorkspaceInAppWorkspace("Customer B");
  }

  static void DisplayPersonalWorkspaceAssets() {

    PowerBIClient pbiClient = GetPowerBiClient();

    Console.WriteLine("Datasets:");
    var datasets = pbiClient.Datasets.GetDatasets().Value;
    foreach (var dataset in datasets) {
      Console.WriteLine(" - " + dataset.Name + " [" + dataset.Id + "]");
    }

    Console.WriteLine();
    Console.WriteLine("Reports:");
    var reports = pbiClient.Reports.GetReports().Value;
    foreach (var report in reports) {
      Console.WriteLine(" - " + report.Name + " [" + report.Id + "]");
    }

    Console.WriteLine();
    Console.WriteLine("Dashboards:");
    var dashboards = pbiClient.Dashboards.GetDashboards().Value;
    foreach (var dashboard in dashboards) {
      Console.WriteLine(" - " + dashboard.DisplayName + " [" + dashboard.Id + "]");
    }

    Console.WriteLine();
  }

  static void CreateAppWorkspace(string Name) {

    PowerBIClient pbiClient = GetPowerBiClient();

    GroupCreationRequest request = new GroupCreationRequest(Name);
    Group aws = pbiClient.Groups.CreateGroup(request);

    //GroupUserAccessRight user1Permissions = new GroupUserAccessRight("Admin", "SOME_USER.onMicrosoft.com");
    //pbiClient.Groups.AddGroupUser(aws.Id, user1Permissions);

    // member does not work yet - API is broken
    //GroupUserAccessRight user2Permissions = new GroupUserAccessRight("Member", "jamesb@pbibc.onMicrosoft.com");
    //pbiClient.Groups.AddGroupUser(aws.Id, user2Permissions);

  }

  static void ClonePersonalWorkspaceInAppWorkspace(string AppWorkpaceName) {

    PowerBIClient pbiClient = GetPowerBiClient();
    string AppWorkspaceId = "";
    var workspaces = pbiClient.Groups.GetGroups().Value;
    foreach (var workspace in workspaces) {
      if (workspace.Name.Equals(AppWorkpaceName)) {
        AppWorkspaceId = workspace.Id;
      }
    }
    if (AppWorkspaceId == "") {
      // create app workspace if it doesn't exist
      Console.WriteLine("Creating app workspace named " + AppWorkpaceName);
      GroupCreationRequest request = new GroupCreationRequest(AppWorkpaceName);
      Group AppWorkspace = pbiClient.Groups.CreateGroup(request);
      AppWorkspaceId = AppWorkspace.Id;
    }





    var reports = pbiClient.Reports.GetReports().Value;
    foreach (var report in reports) {
      // create URL with pattern v1.0/myorg/reports/{report_id}/Export/
      string restUrlDownloadExport =
        urlPowerBiRestApiRoot + "v1.0/myorg/reports/" + report.Id + "/Export/";

      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Add("Accept", "application/json");
      client.DefaultRequestHeaders.Add("Authorization", "Bearer " + GetAccessToken());

      // send PATCH request to Power BI service 
      HttpResponseMessage response = client.GetAsync(restUrlDownloadExport).Result;
      string filePath = @"C:\Demos\" + report.Name + ".pbix";
      Console.WriteLine("Downloading PBIX file for " + report.Name + "to " + filePath);
      FileStream stream1 = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite);
      response.Content.CopyToAsync(stream1).Wait();
      stream1.Close();
      stream1.Dispose();


      FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
      Console.WriteLine("Publishing " + filePath + " to " + AppWorkpaceName);
      var import = pbiClient.Imports.PostImportWithFileInGroup(AppWorkspaceId, stream, report.Name);

      Console.WriteLine("Deleing file " + filePath);
      File.Delete(filePath);

      Console.WriteLine("Publishing process completed");
      Console.WriteLine();

    }




    //GroupCreationRequest request = new GroupCreationRequest("AppWorkpaceName");
    //Group aws = pbiClient.Groups.CreateGroup(request);

    //GroupUserAccessRight user1Permissions = new GroupUserAccessRight("Admin", "JasonB@pbibc.onMicrosoft.com");
    //pbiClient.Groups.AddGroupUser(aws.Id, user1Permissions);

    //string targetWorkspaceId = aws.Id;





    // member does not work yet - API is broken
    //GroupUserAccessRight user2Permissions = new GroupUserAccessRight("Member", "jamesb@pbibc.onMicrosoft.com");
    //pbiClient.Groups.AddGroupUser(aws.Id, user2Permissions);

  }

  static void CloneAppWorkspace(string sourceAppWorkspaceName, string targetAppWorkpaceName) {

    PowerBIClient pbiClient = GetPowerBiClient();
    string sourceAppWorkspaceId = "";
    string targetAppWorkspaceId = "";

    var workspaces = pbiClient.Groups.GetGroups().Value;
    foreach (var workspace in workspaces) {
      if (workspace.Name.Equals(sourceAppWorkspaceName)) {
        sourceAppWorkspaceId = workspace.Id;
      }
      if (workspace.Name.Equals(targetAppWorkpaceName)) {
        targetAppWorkspaceId = workspace.Id;
      }
    }

    if (sourceAppWorkspaceId == "") {
      throw new ApplicationException("Source Workspace does not exist");
    }

    if (targetAppWorkspaceId == "") {
      // create app workspace if it doesn't exist
      Console.WriteLine("Creating app workspace named " + targetAppWorkpaceName);
      GroupCreationRequest request = new GroupCreationRequest(targetAppWorkpaceName);
      Group AppWorkspace = pbiClient.Groups.CreateGroup(request);
      targetAppWorkspaceId = AppWorkspace.Id;

      GroupUserAccessRight user1Permissions = new GroupUserAccessRight("Admin", "pbimasteruser@sharepointconfessions.onMicrosoft.com");
      pbiClient.Groups.AddGroupUser(targetAppWorkspaceId, user1Permissions);

    }

    var reports = pbiClient.Reports.GetReportsInGroup(sourceAppWorkspaceId).Value;

    foreach (var report in reports) {
      // create URL with pattern v1.0/myorg/{workspace_id}/reports/{report_id}/Export/
      string restUrlDownloadExport =
        urlPowerBiRestApiRoot + "v1.0/myorg/groups/" + sourceAppWorkspaceId + "/reports/" + report.Id + "/Export/";

      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Add("Accept", "application/json");
      client.DefaultRequestHeaders.Add("Authorization", "Bearer " + GetAccessToken());

      // send PATCH request to Power BI service 
      HttpResponseMessage response = client.GetAsync(restUrlDownloadExport).Result;
      string filePath = @"C:\temp\" + report.Name + ".pbix";
      Console.WriteLine("Downloading PBIX file for " + report.Name + "to " + filePath);
      FileStream stream1 = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite);
      response.Content.CopyToAsync(stream1).Wait();
      stream1.Close();
      stream1.Dispose();


      FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
      Console.WriteLine("Publishing " + filePath + " to " + targetAppWorkpaceName);
      var import = pbiClient.Imports.PostImportWithFileInGroup(targetAppWorkspaceId, stream, report.Name);

      Console.WriteLine("Deleing file " + filePath);
      File.Delete(filePath);

      Console.WriteLine("Publishing process completed");
      Console.WriteLine();

    }

  }


 
  static void PublishPBIX(string PbixFilePath, string ImportName) {
    Console.WriteLine("Publishing " + PbixFilePath);
    PowerBIClient pbiClient = GetPowerBiClient();
    FileStream stream = new FileStream(PbixFilePath, FileMode.Open, FileAccess.Read);
    var import = pbiClient.Imports.PostImportWithFile(stream, ImportName);
    Console.WriteLine("Publishing process completed");

  }

  static void RefreshDataset(string DatasetName) {
    PowerBIClient pbiClient = GetPowerBiClient();
    IList<Dataset> datasets = pbiClient.Datasets.GetDatasets().Value;
    foreach (var dataset in datasets) {
      if (dataset.Name.Equals(DatasetName)) {
        pbiClient.Datasets.RefreshDataset(dataset.Id);

      }
    }
  }

  public static void PatchDatasourceCredentials(string importName, string sqlAzureUser, string sqlAzurePassword) {

    PowerBIClient pbiClient = GetPowerBiClient();
    IList<Dataset> datasets = pbiClient.Datasets.GetDatasets().Value;
    foreach (var dataset in datasets) {
      if (dataset.Name.Equals(importName)) {

        var Datasource = pbiClient.Datasets.GetGatewayDatasources(dataset.Id).Value[0];
        string DatasourceId = Datasource.Id;
        string GatewayId = Datasource.GatewayId;

        // patching credentials does not yet work through the v2 API
        // you must complete this action with a direct HTTP PATCH request

        // create URL with pattern v1.0/myorg/gateways/{gateway_id}/datasources/{datasource_id}
        string restUrlPatchCredentials =
          urlPowerBiRestApiRoot + "" +
          "v1.0/myorg/" +
          "gateways/" + GatewayId + "/" +
          "datasources/" + DatasourceId + "/";

        // create C# object with credential data
        DataSourceCredentials dataSourceCredentials =
          new DataSourceCredentials {
            credentialType = "Basic",
            basicCredentials = new BasicCredentials {
              username = sqlAzureUser,
              password = sqlAzurePassword
            }
          };

        // serialize C# object into JSON
        string jsonDelta = JsonConvert.SerializeObject(dataSourceCredentials);

        // add JSON to HttpContent object and configure content type
        HttpContent patchRequestBody = new StringContent(jsonDelta);
        patchRequestBody.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");

        // prepare PATCH request
        var method = new HttpMethod("PATCH");
        var request = new HttpRequestMessage(method, restUrlPatchCredentials);
        request.Content = patchRequestBody;

        HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Add("Accept", "application/json");
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + GetAccessToken());

        // send PATCH request to Power BI service 
        var result = client.SendAsync(request).Result;

        Console.WriteLine("Credentials have been updated..");
        Console.WriteLine();

      }
    }

  }

}

public class DataSourceCredentials {
  public string credentialType { get; set; }
  public BasicCredentials basicCredentials { get; set; }
}

public class BasicCredentials {
  public string username { get; set; }
  public string password { get; set; }
}
