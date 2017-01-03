using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.PowerBI.Security;
using Microsoft.Rest;
using System.Configuration;
using Microsoft.PowerBI.Api.V1;
using Microsoft.PowerBI.Api.V1.Models;
using HelloPBIEmbedded.Models;

namespace HelloPBIEmbedded.Controllers {
    public class HomeController : Controller {

        private readonly string workspaceCollection;
        private readonly string workspaceId;
        private readonly string accessKey;
        private readonly string apiUrl;

        public HomeController() {
            this.workspaceCollection = ConfigurationManager.AppSettings["powerbi:WorkspaceCollection"];
            this.workspaceId = ConfigurationManager.AppSettings["powerbi:WorkspaceId"];
            this.accessKey = ConfigurationManager.AppSettings["powerbi:AccessKey"];
            this.apiUrl = ConfigurationManager.AppSettings["powerbi:ApiUrl"];
        }

        public ActionResult Index() {

            // use app key to create credentials used to retreive developer access token
            TokenCredentials credentials = new TokenCredentials(accessKey, "AppKey");
            PowerBIClient client = new PowerBIClient(credentials);

            // call to Power BI REST API to get list of reports inside a specific worksapce
            ODataResponseListReport reportsResult = client.Reports.GetReportsAsync(workspaceCollection, workspaceId).Result;

            // this sample app is hardcoded to load first report in collection
            Report report = reportsResult.Value[0];

            // create the embed token for the report
            PowerBIToken embedToken = PowerBIToken.CreateReportEmbedToken(workspaceCollection, workspaceId, report.Id);

            // Pass report and access token to MVC view for rending
            ReportViewModel reportModel = new ReportViewModel {
                Report = report,
                AccessToken = embedToken.Generate(accessKey)
            };

            return View(reportModel);
        }
    }
}