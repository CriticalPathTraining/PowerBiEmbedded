$(() => {
  $("#create-new-report").click(() => {
    console.log("got here ...");
    $("#modelCreateNewReport").modal();
  });
});


interface IPageCollection extends Array<Page> {
  findIndex(predicate: (page: Page) => boolean): number;
  find(predicate: (page: Page) => boolean): Page
}

interface IPbiModels {
  TokenType: models.TokenType,
  Permissions: models.Permissions.All,
  ViewMode: models.ViewMode.View,
}

class PowerBIEmbedManager {

  static embedReport = (reportId, embedUrl, accessToken, reportContainer) => {

    var report: Report;
    var pages: IPageCollection;

    var currentPage: Page = null;
    var currentPageIndex: number = 0;

    var models = window['powerbi-client'].models;

    var config: embed.IEmbedConfiguration = {
      type: 'report',
      id: reportId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Embed,
      permissions: models.Permissions.All,
      viewMode: models.ViewMode.View,
      pageView: "fitToWidth",
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false
      }
    };

    report = <Report>powerbi.embed(reportContainer, config);

    report.on('loaded', () => {
      report.getPages().then(
        function (reportPages: Page[]) {
          pages = <IPageCollection>reportPages;
          loadReportPages(pages);
        });
    });

    report.on('pageChanged', (evt: service.ICustomEvent<any>) => {
      currentPage = evt.detail.newPage;
      if (pages !== undefined) {
        setActiveReportPage(currentPage);
        currentPageIndex = pages.findIndex((page: Page) => {
          return page.displayName === currentPage.displayName;
        });
      }
    });

    var loadReportPages = (pages: IPageCollection) => {

      currentPageIndex = pages.findIndex((page: Page) => {
        return page.displayName === currentPage.displayName;
      });

      var pageNavigation = $("#page-navigation");
      pageNavigation.empty();
      for (var index = 0; index < pages.length; index++) {
        var reportPageDisplayName = pages[index].displayName;
        pageNavigation.append($("<li>")
          .append($('<a href="javascript:;" >')
            .text(pages[index].displayName))
          .click(function (evt: JQueryInputEventObject) {
            var targetPage = evt.target.textContent ? evt.target.textContent : evt.target.firstChild.textContent;
            pages.find((page) => { return page.displayName === targetPage }).setActive();
          }));
      }

      updateUiReportLoaded();
      setActiveReportPage(currentPage);
    };

    var setActiveReportPage = function (page: Page) {
      // update page name in title area
      $("#reportPageTitle").html("&nbsp; > &nbsp;" + page.displayName);

      // update page links with CSS to visually reflect which page is the active page
      var pageLinks = $("#page-navigation a");
      pageLinks.each((index, value) => {
        var currentLink: JQuery = $(pageLinks[index]);
        if (currentLink.text() === page.displayName) {
          currentLink.parent().addClass("activePage");
        }
        else {
          currentLink.parent().removeClass("activePage");
        }
      });
    };

    var updateSetting = (settingName: string, value: boolean) => {
      var settings = {};
      settings[settingName] = value;
      report.updateSettings(settings);
    }

    var changePage = (direction: number) => {
      var nextPageIndex = currentPageIndex + direction;
      if (nextPageIndex < 0) nextPageIndex = pages.length - 1;
      if (nextPageIndex >= pages.length) nextPageIndex = 0;
      pages[nextPageIndex].setActive();
    }

    var updateUiReportLoading = () => {
      $("#report-loading-message").show();
      $("#loaded-report-panel").hide();
      $("#report-toolbar").hide();
      $("#reportContainer").hide();
    }

    var updateUiReportLoaded = () => {
      $("#report-loading-message").hide();
      $("#loaded-report-panel").show();
      $("#report-toolbar").show();
      $("#reportContainer").show();
    }


    $("#reports a").click(() => { updateUiReportLoading(); });

    $('#setting-shownav').on('change', (evt: JQueryInputEventObject) => {
      var checkbox = <HTMLInputElement>evt.target;
      updateSetting('navContentPaneEnabled', checkbox.checked);
    });

    $('#setting-showfilterpane').on('change', (evt: JQueryInputEventObject) => {
      var checkbox = <HTMLInputElement>evt.target;
      updateSetting('filterPaneEnabled', checkbox.checked);
    });

    $('#goto-prev-page').click(() => { changePage(-1); });
    $('#goto-next-page').click(() => { changePage(1); });

    $("#editMode").click(() => {
      // make sure filter pane is visible
      report.updateSettings({ "filterPaneEnabled": true });
      // switch report into edit mode
      report.switchMode("Edit");
      // update buttons on report toolbar
      $("#editMode").hide();
      $("#viewMode").show();
    });

    $("#viewMode").click(() => {
      // restore user settings for fitler pane and nav
      var showFilterPane = $('#showfilterpane').is(':checked');
      var showNav = $('#setting-shownav').is(':checked');
      report.updateSettings({
        "filterPaneEnabled": showFilterPane,
        "navContentPaneEnabled": showNav
      });
      // switch report to read-only view mode
      report.switchMode("View");
      // update buttons on report toolbar
      $("#editMode").show();
      $("#viewMode").hide();
    });

    $("#refreshReport").click(() => { report.refresh(); });

    $("#printReport").click(() => { report.print(); });

    $("#fullScreen").click(() => { report.fullscreen(); });

  }

  static createReport = (datasetId, embedUrl, accessToken, reportContainer) => {
    $("#reportContainer").show();

    var report: Report;
    var pages: IPageCollection;

    var currentPage: Page = null;
    var currentPageIndex: number = 0;

    var models = window['powerbi-client'].models;

    var config: embed.IEmbedConfiguration = {
      datasetId: datasetId,
      embedUrl: "https://app.powerbi.com//reportEmbed",
      accessToken: accessToken,
      tokenType: models.TokenType.Embed
    };

    report = <Report>powerbi.createReport(reportContainer, config);
    
    var updateUiReportLoaded = () => {
      $("#report-loading-message").hide();
      $("#loaded-report-panel").show();
      $("#report-toolbar").show();
      $("#reportContainer").show();
    }

   // report.off("loaded");
    report.on("loaded", function () {
      console.log("Loaded");
      updateUiReportLoaded();
    });

   // report.off("rendered");
    report.on("rendered", function () {
      console.log("rendered");
    });


   // report.off("error");
    report.on("error", function (event) {
      console.log("ERROR: " + event.detail);

    });

    //report.on("saveAsTriggered", function (event) {
    //  console.log("saveAsTriggered");
    //  console.log(event.detail);
    //});

    report.on("saved", function (event: any) {
      console.log("saved");
      console.log(event.detail);
      window.location.href = "/reports/?reportId=" + event.detail.reportObjectId;
    });


    $("#fullScreen").click(() => { report.fullscreen(); });


    updateUiReportLoaded();
  }

  static embedDashboard = (dashboardId, embedUrl, accessToken, dashboardContainer) => {

    var dashboard;
    var models = window['powerbi-client'].models;

    var config: embed.IEmbedConfiguration = {
      type: 'dashboard',
      id: dashboardId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Embed,
      pageView: "fitToWidth"
    };

    dashboard = powerbi.embed(dashboardContainer, config);

  }

  static createNewReport = function (datasetId) {
    alert("Got here" + datasetId);
  }

}
