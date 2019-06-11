using ThirdPartyEmbeddingDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ThirdPartyEmbeddingDemo.Controllers {

  [Authorize]
  public class ReportsController : Controller {
    

    public async Task<ActionResult> Index() {
      ReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetReportEmbeddingData();
      return View(embeddingData);
    }
    
  }
}