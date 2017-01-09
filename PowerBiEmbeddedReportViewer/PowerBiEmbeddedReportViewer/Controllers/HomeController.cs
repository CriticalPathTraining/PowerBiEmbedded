using System.Web.Mvc;
using System.Linq;
using Microsoft.PowerBI.Security;
using Microsoft.Rest;
using System.Configuration;
using Microsoft.PowerBI.Api.V1;
using Microsoft.PowerBI.Api.V1.Models;

using PowerBiEmbeddedReportViewer.Models;

using System.Collections.Generic;
namespace PowerBiEmbeddedReportViewer.Controllers {
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

    public ActionResult Index(string reportId) {

      // use app key to create credentials used to generate embed tokens
      TokenCredentials credentials = new TokenCredentials(accessKey, "AppKey");
      PowerBIClient client = new PowerBIClient(credentials);

      // call to Power BI REST API to get list of reports inside a specific worksapce
      IList<Report> reports = client.Reports.GetReportsAsync(workspaceCollection, workspaceId).Result.Value;

      var viewModel = new ReportsViewModel {
        Reports = reports.ToList()
      };

      if (!string.IsNullOrEmpty(reportId)) {
        Report report = reports.Where(r => r.Id == reportId).First();
        PowerBIToken embedToken = PowerBIToken.CreateReportEmbedToken(workspaceCollection, workspaceId, report.Id);
        viewModel.CurrentReport = new ReportViewModel {
          Report = report,
          AccessToken = embedToken.Generate(accessKey)
        };
      }

      return View(viewModel);
    }
  }
}