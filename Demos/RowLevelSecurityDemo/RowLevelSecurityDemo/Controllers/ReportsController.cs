using RowLevelSecurityDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace RowLevelSecurityDemo.Controllers {

  [Authorize]
  public class ReportsController : Controller {
    

    public async Task<ActionResult> ReportByRole() {
      ReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetReportEmbeddingDataWithRlsRoles();
      return View(embeddingData);
    }

    public async Task<ActionResult> ReportByState() {
      ReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetReportEmbeddingDataWithStateClaims();
      return View(embeddingData);
    }
  }
}