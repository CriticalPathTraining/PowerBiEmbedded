using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using EmbeddedLab.Models;

namespace EmbeddedLab.Controllers {

  public class HomeController : Controller {

    public ActionResult Index() {
      return View();
    }

    public async Task<ActionResult> Report() {
      ReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetReportEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Dashboard() {
      DashboardEmbeddingData embeddingData = await PbiEmbeddedManager.GetDashboardEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Qna() {
      QnaEmbeddingData embeddingData = await PbiEmbeddedManager.GetQnaEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> NewReport() {
      NewReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetNewReportEmbeddingData();
      return View(embeddingData);
    }

    public async Task<ActionResult> Reports(string reportId) {
      ReportEmbeddingData embeddingData = await PbiEmbeddedManager.GetEmbeddingDataForSpecificReport(reportId);
      return View(embeddingData);
    }
  }
}