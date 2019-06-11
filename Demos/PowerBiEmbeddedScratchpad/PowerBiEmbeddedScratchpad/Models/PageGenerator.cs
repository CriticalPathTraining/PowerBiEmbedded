using System;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.Rest;
using System.IO;
using System.Diagnostics;
using System.Configuration;
using Microsoft.PowerBI.Api.V2.Models;

namespace PowerBiEmbeddedScratchpad.Models {
  class PageGenerator {

    #region "Internal implementation details"

    private static readonly string rootFolder = ConfigurationManager.AppSettings["local-pages-folder"];

    static PageGenerator() {

      Directory.CreateDirectory(rootFolder);
      Directory.CreateDirectory(rootFolder + "css");
      File.WriteAllText(rootFolder + "css/app.css", Properties.Resources.app_css);
      Directory.CreateDirectory(rootFolder + "css/img");
      File.WriteAllBytes(rootFolder + "favicon.ico", Properties.Resources.favicon_ico);
      File.WriteAllBytes(rootFolder + "css/img/loading.gif", Properties.Resources.loading3_gif);
      Directory.CreateDirectory(rootFolder + "scripts");
      File.WriteAllText(rootFolder + "scripts/jquery.js", Properties.Resources.jquery_js);
      File.WriteAllText(rootFolder + "scripts/powerbi.js", Properties.Resources.powerbi_js);
    }

    static private void LaunchPageInBrowser(string pagePath) {
      Process.Start("chrome.exe", " --new-window --app=" + pagePath);
    }

    #endregion

    // *** getting started coding samples for the Power BI JavaScript API ***

    public static void GenerateReportPageWithFirstPartyEmbedding(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingDataFirstParty();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithFirstPartyToken_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo01: 1st Party Report")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo01-EmbedReportFirstParty.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReport_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo02: 3rd Party Report")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);

      
      // generate page file on local har drive
      string pagePath = rootFolder +  "Demo02-EmbedReportThirdParty.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo03: Report Toolbar")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo03-EmbedReportWithToolbar.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo04: Dashboard")
                                    .Replace("@EmbedDashboardId", embeddingData.dashboardId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo04-EmbedDashboard.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo05: Dashboard Tile")
                                    .Replace("@EmbedDashboardId", embeddingData.dashboardId)
                                    .Replace("@EmbedTileId", embeddingData.TileId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo05-EmbedDashboardTile.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo06: New Report")
                                    .Replace("@EmbedWorkspaceId", embeddingData.workspaceId)
                                    .Replace("@EmbedDatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo06-EmbedNewReport.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateNewReportPageWithSaveAsRedirect(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetNewReportEmbeddingDataFirstParty();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedNewReportWithSaveAsRedirect_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo07: New SaveAs")
                                    .Replace("@EmbedWorkspaceId", embeddingData.workspaceId)
                                    .Replace("@EmbedDatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo07-EmbedNewReportWithSaveAsRedirect.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo08: QnA Experience")
                                    .Replace("@DatasetId", embeddingData.datasetId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo08-EmbedQnaExperience.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportPageWithConfigurationOptions(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithConfigurationOptions_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo09: Config Options")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo09-EmbedReportWithConfigurationOptions.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportWithPageNavigation(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithPageNavigation_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo10: Page Navigation")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo10-Page-Navigation.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportPageWithPhasedLoading(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithPhasedLoading_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo11: Phased Loading")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo11-PhasedLoading.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportWithCustomFiltering(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithCustomFiltering_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo12: Custom Filtering")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo12-CustomFiltering.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportWithBookmarks(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithBookmarks_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo13: Bookmarks")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo13-Bookmarks.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportWithBookmarkCarousel(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithBookmarkCarousel_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo14: Bookmark Carousel")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo14-BookmarkCarousel.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

    public static void GenerateReportWithContextMenusPage(bool LaunchInBrowser = true) {

      // get Power BI embedding data
      var embeddingData = PbiEmbeddedManager.GetReportEmbeddingData();

      // parse embedding data into page template
      string htmlSource = Properties.Resources.EmbedReportWithContextMenus_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo15-ReportWithCustomContextMenus")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo15-ReportWithCustomContextMenus.html";
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
      string htmlSource = Properties.Resources.ReportInspector_html;
      string htmlOutput = htmlSource.Replace("@AppName", "Demo16: Inspector")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo16-ReportInspector.html";
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
      string htmlOutput = htmlSource.Replace("@AppName", "Demo17: Single Visual")
                                    .Replace("@EmbedReportId", embeddingData.reportId)
                                    .Replace("@EmbedUrl", embeddingData.embedUrl)
                                    .Replace("@EmbedToken", embeddingData.accessToken);


      // generate page file on local har drive
      string pagePath = rootFolder + "Demo17-EmbeddingSingleVisual.html";
      File.WriteAllText(pagePath, htmlOutput);

      // launch page in browser if requested
      if (LaunchInBrowser) {
        LaunchPageInBrowser(pagePath);
      }
    }

  }
}
