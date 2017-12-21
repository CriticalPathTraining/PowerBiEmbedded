using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using DailyReporterPro.Models;


namespace DailyReporterPro.Controllers {
  public class HomeController : Controller {

    public async Task<ActionResult> Index() {
      var viewModel = await PbiEmbeddedManager.GetHomeView();
      return View(viewModel);
    }

  }
}