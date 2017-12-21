using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using DailyReporterPro.Models;


namespace DailyReporterPro.Controllers {
  public class DashboardsController : Controller {

    public async Task<ActionResult> Index(string DashboardId) {
      var viewModel = await PbiEmbeddedManager.GetDashboards(DashboardId);
      return View(viewModel);
    }

  }
}