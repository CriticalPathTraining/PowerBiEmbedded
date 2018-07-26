$(function () {
    $("#create-new-report").click(function () {
        console.log("got here ...");
        $("#modelCreateNewReport").modal();
    });
});
var PowerBIEmbedManager = /** @class */ (function () {
    function PowerBIEmbedManager() {
    }
    PowerBIEmbedManager.embedReport = function (reportId, embedUrl, accessToken, reportContainer) {
        var report;
        var pages;
        var currentPage = null;
        var currentPageIndex = 0;
        var models = window['powerbi-client'].models;
        var config = {
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
        report = powerbi.embed(reportContainer, config);
        report.on('loaded', function () {
            report.getPages().then(function (reportPages) {
                pages = reportPages;
                loadReportPages(pages);
            });
        });
        report.on('pageChanged', function (evt) {
            currentPage = evt.detail.newPage;
            if (pages !== undefined) {
                setActiveReportPage(currentPage);
                currentPageIndex = pages.findIndex(function (page) {
                    return page.displayName === currentPage.displayName;
                });
            }
        });
        var loadReportPages = function (pages) {
            currentPageIndex = pages.findIndex(function (page) {
                return page.displayName === currentPage.displayName;
            });
            var pageNavigation = $("#page-navigation");
            pageNavigation.empty();
            for (var index = 0; index < pages.length; index++) {
                var reportPageDisplayName = pages[index].displayName;
                pageNavigation.append($("<li>")
                    .append($('<a href="javascript:;" >')
                    .text(pages[index].displayName))
                    .click(function (evt) {
                    var targetPage = evt.target.textContent ? evt.target.textContent : evt.target.firstChild.textContent;
                    pages.find(function (page) { return page.displayName === targetPage; }).setActive();
                }));
            }
            updateUiReportLoaded();
            setActiveReportPage(currentPage);
        };
        var setActiveReportPage = function (page) {
            // update page name in title area
            $("#reportPageTitle").html("&nbsp; > &nbsp;" + page.displayName);
            // update page links with CSS to visually reflect which page is the active page
            var pageLinks = $("#page-navigation a");
            pageLinks.each(function (index, value) {
                var currentLink = $(pageLinks[index]);
                if (currentLink.text() === page.displayName) {
                    currentLink.parent().addClass("activePage");
                }
                else {
                    currentLink.parent().removeClass("activePage");
                }
            });
        };
        var updateSetting = function (settingName, value) {
            var settings = {};
            settings[settingName] = value;
            report.updateSettings(settings);
        };
        var changePage = function (direction) {
            var nextPageIndex = currentPageIndex + direction;
            if (nextPageIndex < 0)
                nextPageIndex = pages.length - 1;
            if (nextPageIndex >= pages.length)
                nextPageIndex = 0;
            pages[nextPageIndex].setActive();
        };
        var updateUiReportLoading = function () {
            $("#report-loading-message").show();
            $("#loaded-report-panel").hide();
            $("#report-toolbar").hide();
            $("#reportContainer").hide();
        };
        var updateUiReportLoaded = function () {
            $("#report-loading-message").hide();
            $("#loaded-report-panel").show();
            $("#report-toolbar").show();
            $("#reportContainer").show();
        };
        $("#reports a").click(function () { updateUiReportLoading(); });
        $('#setting-shownav').on('change', function (evt) {
            var checkbox = evt.target;
            updateSetting('navContentPaneEnabled', checkbox.checked);
        });
        $('#setting-showfilterpane').on('change', function (evt) {
            var checkbox = evt.target;
            updateSetting('filterPaneEnabled', checkbox.checked);
        });
        $('#goto-prev-page').click(function () { changePage(-1); });
        $('#goto-next-page').click(function () { changePage(1); });
        $("#editMode").click(function () {
            // make sure filter pane is visible
            report.updateSettings({ "filterPaneEnabled": true });
            // switch report into edit mode
            report.switchMode("Edit");
            // update buttons on report toolbar
            $("#editMode").hide();
            $("#viewMode").show();
        });
        $("#viewMode").click(function () {
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
        $("#refreshReport").click(function () { report.refresh(); });
        $("#printReport").click(function () { report.print(); });
        $("#fullScreen").click(function () { report.fullscreen(); });
    };
    PowerBIEmbedManager.createReport = function (datasetId, embedUrl, accessToken, reportContainer) {
        $("#reportContainer").show();
        var report;
        var pages;
        var currentPage = null;
        var currentPageIndex = 0;
        var models = window['powerbi-client'].models;
        var config = {
            datasetId: datasetId,
            embedUrl: "https://app.powerbi.com//reportEmbed",
            accessToken: accessToken,
            tokenType: models.TokenType.Embed
        };
        report = powerbi.createReport(reportContainer, config);
        var updateUiReportLoaded = function () {
            $("#report-loading-message").hide();
            $("#loaded-report-panel").show();
            $("#report-toolbar").show();
            $("#reportContainer").show();
        };
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
        report.on("saved", function (event) {
            console.log("saved");
            console.log(event.detail);
            window.location.href = "/reports/?reportId=" + event.detail.reportObjectId;
        });
        $("#fullScreen").click(function () { report.fullscreen(); });
        updateUiReportLoaded();
    };
    PowerBIEmbedManager.embedDashboard = function (dashboardId, embedUrl, accessToken, dashboardContainer) {
        var dashboard;
        var models = window['powerbi-client'].models;
        var config = {
            type: 'dashboard',
            id: dashboardId,
            embedUrl: embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Embed,
            pageView: "fitToWidth"
        };
        dashboard = powerbi.embed(dashboardContainer, config);
    };
    PowerBIEmbedManager.createNewReport = function (datasetId) {
        alert("Got here" + datasetId);
    };
    return PowerBIEmbedManager;
}());
//# sourceMappingURL=App.js.map