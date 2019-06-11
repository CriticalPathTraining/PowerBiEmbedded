using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using AppOwnsDataApp.Models;

namespace AppOwnsDataApp.Controllers {
  public class HomeController : Controller {

    public ActionResult Index() {
      return View();
    }

    public async Task<ActionResult> Report() {
      ReportEmbeddingData embeddingData = await PbiEmbeddingManager.GetReportEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Dashboard() {
      DashboardEmbeddingData embeddingData = await PbiEmbeddingManager.GetDashboardEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Qna() {
      QnaEmbeddingData embeddingData = await PbiEmbeddingManager.GetQnaEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> NewReport() {
      NewReportEmbeddingData embeddingData = await PbiEmbeddingManager.GetNewReportEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Reports(string reportId) {

      ReportEmbeddingData embeddingData =
          await PbiEmbeddingManager.GetEmbeddingDataForReport(reportId);

      return View(embeddingData);
    }



  }
}