using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using DailyReporterPro.Models;

namespace DailyReporterPro.Controllers {
  public class ReportsController : Controller {

    public async Task<ActionResult> Index(string ReportId, string DatasetId) {
      var viewModel = await PbiEmbeddedManager.GetReports(ReportId, DatasetId);
      return View(viewModel);
    }

  }
}