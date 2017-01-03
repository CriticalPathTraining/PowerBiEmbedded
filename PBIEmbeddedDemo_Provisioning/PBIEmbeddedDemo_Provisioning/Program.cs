using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.PowerBI.Api.V1;
using Microsoft.Rest;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using Microsoft.Rest.Serialization;
using Microsoft.PowerBI.Api.V1.Models;
using System.IO;
using System.Threading;

namespace PBIEmbeddedDemo_Provisioning {


  class Program {

    #region "Program Constants and Security Token Mgmt"

    const string armVersionQueryString = "?api-version=2016-09-01";
    const string pbiVersionQueryString = "?api-version=2016-01-29";
    const string armResource = "https://management.core.windows.net/";

    static string clientId = "ea0616ba-638b-4df5-95b9-636659ae5121";
    static Uri redirectUri = new Uri("urn:ietf:wg:oauth:2.0:oob");

    static string powerBiRestApiBaseUrl = "https://api.powerbi.com";
    static string azureRestApiBaseUrl = "https://management.azure.com";

    static string subscriptionId = ConfigurationManager.AppSettings["subscriptionId"];
    static string subscriptionUser = ConfigurationManager.AppSettings["subscriptionUser"];
    static string subscriptionPassword = ConfigurationManager.AppSettings["subscriptionPassword"];
    static string azureProvisioningLocation = ConfigurationManager.AppSettings["azureProvisioningLocation"];    
    static string resourceGroup = ConfigurationManager.AppSettings["resourceGroup"];
    static string workspaceCollectionName = ConfigurationManager.AppSettings["workspaceCollectionName"];
    static string pbixFilePath = ConfigurationManager.AppSettings["pbixFilePath"];
    static string importedReportId = ConfigurationManager.AppSettings["importedReportId"];

    static string azureSqlUser = ConfigurationManager.AppSettings["azureSqlUser"];
    static string azureSqlPassword = ConfigurationManager.AppSettings["azureSqlPassword"];

    static string GetDeveloperAccessToken() {
      // get access token to access Azure resources
      var authContext = new AuthenticationContext("https://login.windows.net/common/oauth2/authorize");
      UserCredential creds = new UserCredential(subscriptionUser, subscriptionPassword);
      AuthenticationResult authResult = authContext.AcquireToken(resource: armResource, clientId: clientId, userCredential: creds);
      return authResult.AccessToken;
    }

    #endregion

    static void Main() {

      List<string> existingResourceGroups = GetResoureGroups(subscriptionId);

      if (existingResourceGroups.Contains(resourceGroup)) {
        Console.WriteLine("Resource group named " + resourceGroup + " already exists");
      }
      else {
        Console.WriteLine("Resource group named " + resourceGroup + " does not exist");
        CreateResourceGroup(subscriptionId, resourceGroup);
      }
      
      List<string> existingWorkspaceCollectionNames = GetWorkspaceCollectionNames(subscriptionId, resourceGroup);

      if (existingWorkspaceCollectionNames.Contains(workspaceCollectionName)) {
        Console.WriteLine("Workspace collection named " + workspaceCollectionName + " already exists");
      }
      else {
        Console.WriteLine("Workspace collection named " + workspaceCollectionName + " does not exist");
        CreateWorkspaceCollection(subscriptionId, resourceGroup, workspaceCollectionName);
      }

      var key = GetWorkspaceCollectionKey(subscriptionId, resourceGroup, workspaceCollectionName);
      //Console.WriteLine("Access Key: " + key);

      var metadata = GetWorkspaceCollectionMetadata(subscriptionId, resourceGroup, workspaceCollectionName);
      //Console.WriteLine(metadata);


      Workspace workspace = GetFirstWorkspace(workspaceCollectionName);
      Console.WriteLine("Workspace ID: " + workspace.WorkspaceId);

      Console.WriteLine();
      Console.WriteLine("Deleting all existing datasets in workspace during testing");
      DeleteAllDatasets(workspaceCollectionName, workspace.WorkspaceId);

      Console.WriteLine();
      Console.WriteLine("Import new PBIX file to create a new dataset");
      Import imported = ImportPbix(workspaceCollectionName, workspace.WorkspaceId, importedReportId, pbixFilePath);

      Console.WriteLine();
      Console.WriteLine("List data source information for new dataset");
      ListDatasets(workspaceCollectionName, workspace.WorkspaceId);


    }

    static List<string> GetResoureGroups(string subscriptionId) {
      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}",
                            azureRestApiBaseUrl, subscriptionId, armVersionQueryString);

      HttpClient client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Get, url);
      // Set authorization header from you acquired Azure AD token
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());
      var response = client.SendAsync(request).Result;
      var json = response.Content.ReadAsStringAsync().Result;

      IEnumerable<ResourceGroup> resourceGroups = JsonConvert.DeserializeObject<ResourceGroupsResult>(json).value;
      List<string> resourceGroupList = new List<string>();
      foreach (ResourceGroup group in resourceGroups) {
        resourceGroupList.Add(group.name);
      }

      return resourceGroupList;      
    }

    static void CreateResourceGroup(string subscriptionId, string resourceGroupName) {

      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/{3}",
                              azureRestApiBaseUrl, subscriptionId, resourceGroupName, armVersionQueryString);

      HttpClient client = new HttpClient();

      ResourceGroup newResourceGroup = new ResourceGroup {
        location = azureProvisioningLocation,
        name = resourceGroupName,       
      };

      string jsonNewResourceGroup = JsonConvert.SerializeObject(newResourceGroup);

      using (client) {
        var content = new StringContent(jsonNewResourceGroup, Encoding.UTF8);
        content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json; charset=utf-8");
        var request = new HttpRequestMessage(HttpMethod.Put, url);
        // Set authorization header from you acquired Azure AD token
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());
        request.Content = content;

        var response = client.SendAsync(request).Result;
        if (response.StatusCode != HttpStatusCode.Created) {
          var responseText = response.Content.ReadAsStringAsync().Result;
          var message = string.Format("Status: {0}, Reason: {1}, Message: {2}", response.StatusCode, response.ReasonPhrase, responseText);
          throw new Exception(message);
        }

        var json = response.Content.ReadAsStringAsync().Result;
        Console.WriteLine("Resource group has been created");
        return;
      }
    }

    static List<string> GetWorkspaceCollectionNames(string subscriptionId, string resourceGroup) {

      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}",
                              azureRestApiBaseUrl, subscriptionId, resourceGroup, pbiVersionQueryString);

      HttpClient client = new HttpClient();


      var request = new HttpRequestMessage(HttpMethod.Get, url);
      // Set authorization header from you acquired Azure AD token
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());

      var response = client.SendAsync(request).Result;
      var json = response.Content.ReadAsStringAsync().Result;

      WorkspaceCollectionsResult coll = JsonConvert.DeserializeObject<WorkspaceCollectionsResult>(json);
      List<string> workspaceNames = new List<string>();
      foreach (WorkspaceCollection ws in coll.value) {
        workspaceNames.Add(ws.name);
      }

      return workspaceNames;
    }

    static void CreateWorkspaceCollection(string subscriptionId, string resourceGroup, string workspaceCollectionName) {

      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}{4}",
                              azureRestApiBaseUrl, subscriptionId, resourceGroup, workspaceCollectionName, pbiVersionQueryString);

      HttpClient client = new HttpClient();

      WorkspaceCollection newWorkspaceCollection = new WorkspaceCollection {
        location = azureProvisioningLocation,
        name = workspaceCollectionName,
        sku = new Sku {  name="S1", tier="Standard"}
      };

      string jsonNewWorkspaceCollection = JsonConvert.SerializeObject(newWorkspaceCollection);

      using (client) {
        var content = new StringContent(jsonNewWorkspaceCollection, Encoding.UTF8);
        content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json; charset=utf-8");
        var request = new HttpRequestMessage(HttpMethod.Put, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());
        request.Content = content;
        var response = client.SendAsync(request).Result;
        if (response.StatusCode != HttpStatusCode.OK) {
          var responseText = response.Content.ReadAsStringAsync().Result;
          var message = string.Format("Status: {0}, Reason: {1}, Message: {2}", response.StatusCode, response.ReasonPhrase, responseText);
          throw new Exception(message);
        }
        var json = response.Content.ReadAsStringAsync().Result;
        Console.WriteLine("Workspace collection named " + workspaceCollectionName + " has been created");
        return;
      }
    }

    static string GetWorkspaceCollectionKey(string subscriptionId, string resourceGroup, string workspaceCollectionName) {
      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}/listkeys{4}",
                               azureRestApiBaseUrl, subscriptionId, resourceGroup, workspaceCollectionName, pbiVersionQueryString);

      HttpClient client = new HttpClient();

      using (client) {
        var request = new HttpRequestMessage(HttpMethod.Post, url);
        // Set authorization header from you acquired Azure AD token
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());
        request.Content = new StringContent(string.Empty);
        var response = client.SendAsync(request).Result;

        if (response.StatusCode != HttpStatusCode.OK) {
          var responseText = response.Content.ReadAsStringAsync().Result;
          var message = string.Format("Status: {0}, Reason: {1}, Message: {2}", response.StatusCode, response.ReasonPhrase, responseText);
          throw new Exception(message);
        }

        var json = response.Content.ReadAsStringAsync().Result;
        var keys = JsonConvert.DeserializeObject<WorkspaceCollectionKeysResult>(json);
        return keys.key1;
      }
    }

    static string GetWorkspaceCollectionMetadata(string subscriptionId, string resourceGroup, string workspaceCollectionName) {

      var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}{4}",
                              azureRestApiBaseUrl, subscriptionId, resourceGroup, workspaceCollectionName, pbiVersionQueryString);

      HttpClient client = new HttpClient();

      using (client) {
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        // Set authorization header from you acquired Azure AD token
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetDeveloperAccessToken());
        var response = client.SendAsync(request).Result;

        if (response.StatusCode != HttpStatusCode.OK) {
          var message = response.Content.ReadAsStringAsync().Result;
          throw new Exception(message);
        }

        var json = response.Content.ReadAsStringAsync().Result;
        return json;
      }
    }

    static PowerBIClient CreatePowerBIClient() {

      // get access key for current workspace collection
      string accessKey = GetWorkspaceCollectionKey(subscriptionId, resourceGroup, workspaceCollectionName);
      
      // Create a token credentials with "AppKey" type
      var credentials = new TokenCredentials(accessKey, "AppKey");      
      
      // Instantiate your Power BI client passing in the required credentials
      var client = new PowerBIClient(credentials);

      // Override the api endpoint base URL.  Default value is https://api.powerbi.com
      client.BaseUri = new Uri(powerBiRestApiBaseUrl);

      // return Power BI API object to caller
      return client;
    }

    static Workspace CreateWorkspace(string workspaceCollectionName) {
      using (var client = CreatePowerBIClient()) {
        // Create a new workspace witin the specified collection
        return client.Workspaces.PostWorkspaceAsync(workspaceCollectionName).Result;
      }
    }

    static IList<Workspace> GetWorkspaces(string workspaceCollectionName) {
      using (var client = CreatePowerBIClient()) {
        var response = client.Workspaces.GetWorkspacesByCollectionNameAsync(workspaceCollectionName).Result;
        return response.Value;
      }
    }

    static Workspace GetFirstWorkspace(string workspaceCollectionName) {
      using (var client = CreatePowerBIClient()) {
        var workspaces = client.Workspaces.GetWorkspacesByCollectionNameAsync(workspaceCollectionName).Result.Value;
        if(workspaces.Count > 0) {
          return workspaces.First();
        }
        else {
          CreateWorkspace(workspaceCollectionName);
          workspaces = client.Workspaces.GetWorkspacesByCollectionNameAsync(workspaceCollectionName).Result.Value;
          return workspaces.First();
        }
      }
    }

    static Import ImportPbix(string workspaceCollectionName, string workspaceId, string datasetName, string filePath) {
      using (var fileStream = File.OpenRead(filePath.Trim('"'))) {
        using (var client = CreatePowerBIClient()) {
          // Set request timeout to support uploading large PBIX files
          client.HttpClient.Timeout = TimeSpan.FromMinutes(60);
          client.HttpClient.DefaultRequestHeaders.Add("ActivityId", Guid.NewGuid().ToString());

          // Import PBIX file from the file stream
          var import = client.Imports.PostImportWithFileAsync(workspaceCollectionName, workspaceId, fileStream, datasetName).Result;

          // Example of polling the import to check when the import has succeeded.
          while (import.ImportState != "Succeeded" && import.ImportState != "Failed") {
            import = client.Imports.GetImportByIdAsync(workspaceCollectionName, workspaceId, import.Id).Result;
            Console.WriteLine("Checking import state... {0}", import.ImportState);
            Thread.Sleep(1000);
          }

          return import;
        }
      }
    }

    static void ListDatasets(string workspaceCollectionName, string workspaceId) {
      using (var client = CreatePowerBIClient()) {
        ODataResponseListDataset response = client.Datasets.GetDatasetsAsync(workspaceCollectionName, workspaceId).Result;

        if (response.Value.Any()) {
          foreach (Dataset d in response.Value) {
            Console.WriteLine("-------------------------------------------");
            Console.WriteLine("Dataset: {0} ({1})", d.Name, d.Id);

            var sources = client.Datasets.GetGatewayDatasourcesAsync(workspaceCollectionName, workspaceId, d.Id).Result;

            foreach (var ds in sources.Value) {             
              Console.WriteLine(" - Data source ID: " + ds.Id);
              Console.WriteLine(" - Data source Type: " + ds.DatasourceType);
              Console.WriteLine(" - Gateway ID: " + ds.GatewayId);
              Console.WriteLine(" - Connection Details: " + ds.ConnectionDetails);
              Console.WriteLine();
            }
          }
        }
        else {
          Console.WriteLine("No Datasets found in this workspace");
        }
      }
    }

    static void DeleteDataset(string workspaceCollectionName, string workspaceId, string datasetId) {
      using (var client = CreatePowerBIClient()) {
        client.Datasets.DeleteDatasetByIdAsync(workspaceCollectionName, workspaceId, datasetId).Wait();

      }
    }


    static void DeleteAllDatasets(string workspaceCollectionName, string workspaceId) {
      using (var client = CreatePowerBIClient()) {
        var datasets = client.Datasets.GetDatasetsAsync(workspaceCollectionName, workspaceId).Result.Value;
        foreach(var dataset in datasets) {
          Console.WriteLine("Deleting dataset named " + dataset.Id + "...");
          client.Datasets.DeleteDatasetByIdAsync(workspaceCollectionName, workspaceId, dataset.Id).Wait();
        }
      }
    }

    static void UpdateConnection(string workspaceCollectionName, string workspaceId, string datasetId) {


      string connectionString = null;
      Console.Write("Connection String (enter to skip): ");
      connectionString = Console.ReadLine();
      Console.WriteLine();

      using (var client = CreatePowerBIClient()) {
        // Optionally udpate the connectionstring details if preent
        if (!string.IsNullOrWhiteSpace(connectionString)) {
          var connectionParameters = new Dictionary<string, object>
          {
                        { "connectionString", connectionString }
                    };
          client.Datasets.SetAllConnectionsAsync(workspaceCollectionName, workspaceId, datasetId, connectionParameters).Wait();
        }

        // Get the datasources from the dataset
        var datasources = client.Datasets.GetGatewayDatasourcesAsync(workspaceCollectionName, workspaceId, datasetId).Result;

        // Reset your connection credentials
        var delta = new GatewayDatasource {
          CredentialType = "Basic",
          BasicCredentials = new BasicCredentials {
            Username = azureSqlUser,
            Password = azureSqlPassword
          }
        };

        if (datasources.Value.Count != 1) {
          Console.Write("Expected one datasource, updating the first");
        }

        // Update the datasource with the specified credentials
        client.Gateways.PatchDatasourceAsync(workspaceCollectionName, workspaceId, datasources.Value[0].GatewayId, datasources.Value[0].Id, delta).Wait();
      }
    }

  }
}
