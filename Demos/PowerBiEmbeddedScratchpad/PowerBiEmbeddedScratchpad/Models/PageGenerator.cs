using System;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.Rest;
using System.IO;
using System.Diagnostics;
using Microsoft.PowerBI.Api.V2.Models;

namespace PowerBiEmbeddedScratchpad.Models {
  class PageGenerator {

    #region "Internal implementation details"

    private const string rootFolder = @"C:\Demo\EmbeddedDemoPages\";

    static PageGenerator() {
      Directory.CreateDirectory(rootFolder);
      Directory.CreateDirectory(rootFolder + "css");
      File.WriteAllText(rootFolder + "css/app.css", Properties.Resources.app_css);
      Directory.CreateDirectory(rootFolder + "scripts");
      File.WriteAllText(rootFolder + "scripts/jquery.js", Properties.Resources.jquery_js);
      File.WriteAllText(rootFolder + "scripts/powerbi.js", Properties.Resources.powerbi_js);
    }

    static private void LaunchPageInBrowser(string pagePath) {
      Process.Start("chrome.exe", " --new-window --app=" + pagePath);
    }

    #endregion

    public static void GenerateReportPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReport_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.reportName)
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);

      
      // generate page file on local har drive
      string pageFileName = embeddingData.reportName.Replace(" ", "-");
      string pagePath = rootFolder +  pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportPageFirstParty(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingDataFirstParty();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReport_FirstParty_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.reportName)
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = embeddingData.reportName.Replace(" ", "-");
      string pagePath = rootFolder + pageFileName + "_FirstParty.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }


    public static void GenerateReportWithToolbarPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithToolbar_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.reportName)
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = embeddingData.reportName.Replace(" ", "-");
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }


    public static void GenerateNewReportPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetNewReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedNewReport_html;
      string htmlOutput = htmlSource.Replace("@AppName", "New Report")
                                    .Replace("@EmbedWorkspaceId", embeddingData.workspaceId)
                                    .Replace("@EmbedDatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = "NewReport";
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateNewReportPageFirstParty(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetNewReportEmbeddingDataFirstParty();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedNewReport_FirstParty_html;
      string htmlOutput = htmlSource.Replace("@AppName", "New Report")
                                    .Replace("@EmbedWorkspaceId", embeddingData.workspaceId)
                                    .Replace("@EmbedDatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = "NewReport";
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateDashboardPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetDashboardEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedDashboard_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.dashboardName)
                                    .Replace("@EmbedDashboardId", embeddingData.dashboardId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = embeddingData.dashboardName.Replace(" ", "-");
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }


    public static void GenerateDashboardTilePage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetDashboardTileEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedDashboardTile_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.TileTitle)
                                    .Replace("@EmbedDashboardId", embeddingData.dashboardId)
                                    .Replace("@EmbedTileId", embeddingData.TileId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = embeddingData.TileTitle.Replace(" ", "-");
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportInspectorPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbeddedReportInspector_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.reportName)
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = "ReportInspector";
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportVisualPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportVisual_html;
      string htmlOutput = htmlSource.Replace("@AppName", embeddingData.reportName)
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = embeddingData.reportName.Replace(" ", "-");
      string pagePath = rootFolder + pageFileName + "-Visual.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateQnaPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetQnaEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedQna_html;
      string htmlOutput = htmlSource.Replace("@DatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pageFileName = "EmbeddedQna";
      string pagePath = rootFolder + pageFileName + ".html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }


  }
}
