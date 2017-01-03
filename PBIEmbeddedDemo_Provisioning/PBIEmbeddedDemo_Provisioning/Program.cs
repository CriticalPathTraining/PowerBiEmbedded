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

        const string version = "?api-version=2016-01-29";
        const string armResource = "https://management.core.windows.net/";
        static string clientId = "ea0616ba-638b-4df5-95b9-636659ae5121";
        static Uri redirectUri = new Uri("urn:ietf:wg:oauth:2.0:oob");

        static string apiEndpointUri = "https://api.powerbi.com";
        static string azureEndpointUri = "https://management.azure.com";
        static string subscriptionId = ConfigurationManager.AppSettings["subscriptionId"];
         static string username = ConfigurationManager.AppSettings["username"];
        static string password = ConfigurationManager.AppSettings["password"];
        static string accessKey = ConfigurationManager.AppSettings["accessKey"];
        static string datasetId = ConfigurationManager.AppSettings["datasetId"];
        static string workspaceId = ConfigurationManager.AppSettings["workspaceId"];
        static string azureToken = null;

        #region "Security and Access Token Mgmt"

        static string GetAccessToken() {

            // get access token to access Azure resources
            var authContext = new AuthenticationContext("https://login.windows.net/common/oauth2/authorize");
            UserCredential creds = new UserCredential(username, password);
            AuthenticationResult authResult = authContext.AcquireToken(resource: armResource, clientId: clientId, userCredential: creds);
            string accessToken = authResult.AccessToken;
            string refreshToken = authResult.RefreshToken;

            //// determine Azure AD tenant ID for current user
            //var httpClient = new HttpClient();
            //httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
            //var response = httpClient.GetStringAsync("https://management.azure.com/tenants?api-version=2016-01-29").Result;
            //var tenantsJson = JsonConvert.DeserializeObject<JObject>(response);
            //var tenants = tenantsJson["value"] as JArray;
            //IEnumerable<string> tenantIds = tenants.Select(t => t["tenantId"].Value<string>());
            //string tenantId = tenantIds.First();


            //var authority = string.Format("https://login.windows.net/{0}/oauth2/authorize", tenantId);
            //var result = authContext.AcquireTokenByRefreshTokenAsync(refreshToken, clientId, armResource).Result;

            return accessToken;
        }

        #endregion



        static string resourceGroup = "rg1";
        static string workspaceCollectionName = "Bob";
        static string datasetName = "demo1";
        static string pbixFilePath = @"c:\demo\NorthwindRetro.pbix";

        static void Main() {



            string[] names = GetWorkspaceCollectionNames(subscriptionId, "rg1");

            if (names.Contains(workspaceCollectionName)) {
                Console.WriteLine("Workspace Collection Already Exists");
            }
            else {
                Console.WriteLine("Workspace collection does not exist. Creating it now");
                CreateWorkspaceCollection(subscriptionId, resourceGroup, workspaceCollectionName);
            }

            var key = GetWorkspaceCollectionKey(subscriptionId, resourceGroup, workspaceCollectionName);
            Console.WriteLine("Access Key: " + key);

            var metadata = GetWorkspaceCollectionMetadata(subscriptionId, resourceGroup, workspaceCollectionName);
            //Console.WriteLine(metadata);

            string workspaceId = "";
            var workspaces = GetWorkspaces(workspaceCollectionName);
            if(workspaces.Count() > 0) {
                workspaceId = workspaces.First().WorkspaceId;
            }
            else {
                Console.WriteLine("Creating new worksapce");
                var newWorkspace = CreateWorkspace(workspaceCollectionName);
                workspaceId = newWorkspace.WorkspaceId;
            }

            Console.WriteLine("Workspace ID: " + workspaceId);

          
            Import imported = ImportPbix(workspaceCollectionName, workspaceId, datasetName, pbixFilePath );

            ListDatasets(workspaceCollectionName, workspaceId);


        }

        static string[] GetWorkspaceCollectionNames(string subscriptionId, string resourceGroup) {

            var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}",
                                    azureEndpointUri, subscriptionId, resourceGroup, version);

            HttpClient client = new HttpClient();


            var request = new HttpRequestMessage(HttpMethod.Get, url);
            // Set authorization header from you acquired Azure AD token
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());

            var response = client.SendAsync(request).Result;
            var json = response.Content.ReadAsStringAsync().Result;

            WorkspaceCollectionsResult coll = JsonConvert.DeserializeObject<WorkspaceCollectionsResult>(json);
            List<string> workspaceNames = new List<string>();
            foreach (WorkspaceCollectionResult ws in coll.value) {
                workspaceNames.Add(ws.name);
            }

            return workspaceNames.ToArray();
        }

        static void CreateWorkspaceCollection(string subscriptionId, string resourceGroup, string workspaceCollectionName) {

            var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}{4}",
                                    azureEndpointUri, subscriptionId, resourceGroup, workspaceCollectionName, version);

            HttpClient client = new HttpClient();

            using (client) {
                var content = new StringContent(@"{
                                                ""location"": ""southcentralus"",
                                                ""tags"": {},
                                                ""sku"": {
                                                    ""name"": ""S1"",
                                                    ""tier"": ""Standard""
                                                }
                                            }", Encoding.UTF8);
                content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json; charset=utf-8");

                var request = new HttpRequestMessage(HttpMethod.Put, url);
                // Set authorization header from you acquired Azure AD token
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
                request.Content = content;

                var response = client.SendAsync(request).Result;
                if (response.StatusCode != HttpStatusCode.OK) {
                    var responseText = response.Content.ReadAsStringAsync().Result;
                    var message = string.Format("Status: {0}, Reason: {1}, Message: {2}", response.StatusCode, response.ReasonPhrase, responseText);
                    throw new Exception(message);
                }

                var json = response.Content.ReadAsStringAsync().Result;
                Console.WriteLine("Workspace collection has been created");
                return;
            }
        }

        static WorkspaceCollectionKeysResult ListWorkspaceCollectionKeys(string subscriptionId, string resourceGroup, string workspaceCollectionName) {
            var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}/listkeys{4}", azureEndpointUri, subscriptionId, resourceGroup, workspaceCollectionName, version);

            HttpClient client = new HttpClient();

            using (client) {
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                // Set authorization header from you acquired Azure AD token
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
                request.Content = new StringContent(string.Empty);
                var response = client.SendAsync(request).Result;

                if (response.StatusCode != HttpStatusCode.OK) {
                    var responseText = response.Content.ReadAsStringAsync().Result;
                    var message = string.Format("Status: {0}, Reason: {1}, Message: {2}", response.StatusCode, response.ReasonPhrase, responseText);
                    throw new Exception(message);
                }

                var json = response.Content.ReadAsStringAsync().Result;
                return SafeJsonConvert.DeserializeObject<WorkspaceCollectionKeysResult>(json);
            }
        }

        static string GetWorkspaceCollectionKey(string subscriptionId, string resourceGroup, string workspaceCollectionName) {
            var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}/listkeys{4}", azureEndpointUri, subscriptionId, resourceGroup, workspaceCollectionName, version);

            HttpClient client = new HttpClient();

            using (client) {
                var request = new HttpRequestMessage(HttpMethod.Post, url);
                // Set authorization header from you acquired Azure AD token
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
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
            var url = string.Format("{0}/subscriptions/{1}/resourceGroups/{2}/providers/Microsoft.PowerBI/workspaceCollections/{3}{4}", azureEndpointUri, subscriptionId, resourceGroup, workspaceCollectionName, version);
            HttpClient client = new HttpClient();

            using (client) {
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                // Set authorization header from you acquired Azure AD token
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAccessToken());
                var response = client.SendAsync(request).Result;

                if (response.StatusCode != HttpStatusCode.OK) {
                    var message = response.Content.ReadAsStringAsync().Result;
                    throw new Exception(message);
                }

                var json = response.Content.ReadAsStringAsync().Result;
                return json;
            }
        }

        static PowerBIClient CreateClient() {

            string accessKey = GetWorkspaceCollectionKey(subscriptionId, resourceGroup, workspaceCollectionName);

            // Create a token credentials with "AppKey" type
            var credentials = new TokenCredentials(accessKey, "AppKey");



            // Instantiate your Power BI client passing in the required credentials
            var client = new PowerBIClient(credentials);

            // Override the api endpoint base URL.  Default value is https://api.powerbi.com
            client.BaseUri = new Uri(apiEndpointUri);

            return client;
        }

        static Workspace CreateWorkspace(string workspaceCollectionName) {
            using (var client = CreateClient()) {
                // Create a new workspace witin the specified collection
                return client.Workspaces.PostWorkspaceAsync(workspaceCollectionName).Result;
            }
        }

        static IEnumerable<Workspace> GetWorkspaces(string workspaceCollectionName) {
            using (var client = CreateClient()) {
                var response = client.Workspaces.GetWorkspacesByCollectionNameAsync(workspaceCollectionName).Result;
                return response.Value;
            }
        }

        static void DisplayWorkspaces(string workspaceCollectionName) {
            using (var client = CreateClient()) {
                var response = client.Workspaces.GetWorkspacesByCollectionNameAsync(workspaceCollectionName).Result;
                foreach (var ws in response.Value){
                    Console.WriteLine(ws.WorkspaceId);
                }
            }
        }

        static Import ImportPbix(string workspaceCollectionName, string workspaceId, string datasetName, string filePath) {
            using (var fileStream = File.OpenRead(filePath.Trim('"'))) {
                using (var client = CreateClient()) {
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
            using (var client = CreateClient()) {
                ODataResponseListDataset response = client.Datasets.GetDatasetsAsync(workspaceCollectionName, workspaceId).Result;

                if (response.Value.Any()) {
                    foreach (Dataset d in response.Value) {
                        Console.WriteLine("{0}:  {1}", d.Name, d.Id);

                        var sources = client.Datasets.GetGatewayDatasourcesAsync(workspaceCollectionName, workspaceId, d.Id).Result;

                        foreach (var ds in sources.Value) {
                            Console.WriteLine("Connection info " + d.Name);
                            Console.WriteLine(ds.Id);
                            Console.WriteLine(ds.DatasourceType);
                            Console.WriteLine(ds.GatewayId);
                            Console.WriteLine(ds.ConnectionDetails);
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
            using (var client = CreateClient()) {
                client.Datasets.DeleteDatasetByIdAsync(workspaceCollectionName, workspaceId, datasetId).Wait();

            }
        }

        static void UpdateConnection(string workspaceCollectionName, string workspaceId, string datasetId) {


            string connectionString = null;
            Console.Write("Connection String (enter to skip): ");
            connectionString = Console.ReadLine();
            Console.WriteLine();

            using (var client = CreateClient()) {
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
                        Username = username,
                        Password = password
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
