var myApp;
(function (myApp) {
    $(function () {
        myApp.SpaAuthService.uiUpdateCallback = onAuthenticationCompleted;
        $("#dashboards").click(function () { getDashboards(); });
        $("#reports").click(function () { getReports(); });
        $("#datasets").click(function () { getDatasets(); });
        $("#login").click(function () {
            myApp.SpaAuthService.login();
        });
        $("#logout").click(function () {
            myApp.SpaAuthService.logout();
            refreshUi();
        });
        refreshUi();
    });
    var onAuthenticationCompleted = function () {
        refreshUi();
    };
    var refreshUi = function () {
        if (myApp.SpaAuthService.userIsAuthenticated) {
            $("#user-greeting").text(myApp.SpaAuthService.userName);
            $("#login").hide();
            $("#logout").show();
            $("#dashboards").show();
            $("#reports").show();
            $("#datasets").show();
        }
        else {
            $("#login").show();
            $("#logout").hide();
            $("#dashboards").hide();
            $("#reports").hide();
            $("#datasets").hide();
        }
    };
    var reports;
    var getReports = function () {
        // reset embed container
        powerbi.reset(document.getElementById('embedContainer'));
        myApp.PowerBiService.GetReports().then(function (data) {
            reports = data.value;
            $("#navigation").empty();
            $("#navigation").append($("<div>", { class: "nav-header" }).text("Reports"));
            var list = $("<ul>");
            for (var i = 0; i <= reports.length; i++) {
                var link = $("<a>", { class: "nav-link" }).text(reports[i].name);
                link.attr("href", "JavaScript:void(0)");
                link.click(onEmbedReport);
                var listItem = $("<li>", { class: "nav-item" }).append(link);
                $("#navigation").append(listItem);
            }
        });
    };
    var onEmbedReport = function (event) {
        var button = event.target;
        var reportName = button.innerText;
        for (var i = 0; i <= reports.length; i++) {
            if (reports[i].name == reportName) {
                embedReport(reports[i]);
            }
        }
    };
    var embedReport = function (report) {
        // Get a reference to the embedded report HTML element
        var embedContainer = document.getElementById('embedContainer');
        // reset target div
        powerbi.reset(embedContainer);
        // data required for embedding Power BI report
        var embedReportId = report.id;
        var embedUrl = report.embedUrl;
        var accessToken = myApp.SpaAuthService.accessToken;
        // Get models object to access enums for embed configuration
        var models = window['powerbi-client'].models;
        var config = {
            type: 'report',
            id: embedReportId,
            embedUrl: embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
            permissions: models.Permissions.All,
            viewMode: models.ViewMode.View,
            settings: {
                filterPaneEnabled: false,
                navContentPaneEnabled: true,
                background: models.BackgroundType.Transparent
            }
        };
        // Embed the report and display it within the div container
        var embeddedReport = powerbi.embed(embedContainer, config);
    };
    var dashboards;
    var getDashboards = function () {
        // reset embed container
        powerbi.reset(document.getElementById('embedContainer'));
        myApp.PowerBiService.GetDashboards().then(function (data) {
            dashboards = data.value;
            $("#navigation").empty();
            $("#navigation").append($("<div>", { class: "nav-header" }).text("Dashboards"));
            var list = $("<ul>");
            for (var i = 0; i < dashboards.length; i++) {
                console.log(dashboards[i]);
                var link = $("<a>", { class: "nav-link" }).text(dashboards[i].displayName);
                link.attr("href", "JavaScript:void(0)");
                link.click(onEmbedDashboard);
                var listItem = $("<li>", { class: "nav-item" }).append(link);
                $("#navigation").append(listItem);
            }
        });
    };
    var onEmbedDashboard = function (event) {
        var button = event.target;
        var dashboardName = button.innerText;
        for (var i = 0; i < dashboards.length; i++) {
            console.log(dashboards[i]);
            if (dashboards[i].displayName == dashboardName) {
                embedDashboard(dashboards[i]);
            }
        }
    };
    var embedDashboard = function (dashboard) {
        // Get a reference to the embedded report HTML element
        var embedContainer = document.getElementById('embedContainer');
        // reset target div
        powerbi.reset(embedContainer);
        // data required for embedding Power BI dashboard
        var embedDashboardId = dashboard.id;
        var embedUrl = dashboard.embedUrl;
        var accessToken = myApp.SpaAuthService.accessToken;
        // Get models object to access enums for embed configuration
        var models = window['powerbi-client'].models;
        var config = {
            type: 'dashboard',
            id: embedDashboardId,
            embedUrl: embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
            pageView: "fitToWidth" // choices are "actualSize", "fitToWidth" or "oneColumn"
        };
        // Embed the report and display it within the div container.
        var embeddedDashboard = powerbi.embed(embedContainer, config);
    };
    var datasets;
    var getDatasets = function () {
        // reset embed container
        powerbi.reset(document.getElementById('embedContainer'));
        myApp.PowerBiService.GetDatasets().then(function (data) {
            datasets = data.value;
            $("#navigation").empty();
            $("#navigation").append($("<div>", { class: "nav-header" }).text("Datasets"));
            var list = $("<ul>");
            for (var i = 0; i <= datasets.length; i++) {
                var link = $("<a>", { class: "nav-link" }).text(datasets[i].name);
                link.attr("href", "JavaScript:void(0)");
                link.click(onEmbedNewReport);
                var listItem = $("<li>", { class: "nav-item" }).append(link);
                $("#navigation").append(listItem);
            }
        });
    };
    var onEmbedNewReport = function (event) {
        var button = event.target;
        var datasetName = button.innerText;
        for (var i = 0; i < datasets.length; i++) {
            if (datasets[i].name == datasetName) {
                embedNewReport(datasets[i]);
            }
        }
    };
    var embedNewReport = function (dataset) {
        // Get a reference to the embedded report HTML element
        var embedContainer = document.getElementById('embedContainer');
        // reset target div
        powerbi.reset(embedContainer);
        // Get data required for embedding
        var embedWorkspaceId = myApp.PowerBiService.appWorkspaceId;
        var embedDatasetId = dataset.id;
        var embedUrl = "https://app.powerbi.com/reportEmbed?groupId=" + myApp.PowerBiService.appWorkspaceId;
        var accessToken = myApp.SpaAuthService.accessToken;
        // Get models object to access enums for embed configuration
        var models = window['powerbi-client'].models;
        var config = {
            datasetId: embedDatasetId,
            embedUrl: embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
        };
        console.log(config);
        // Get a reference to the embedded report HTML element
        var embedContainer = document.getElementById('embedContainer');
        // Embed the report and display it within the div container.
        var report = powerbi.createReport(embedContainer, config);
    };
})(myApp || (myApp = {}));
//# sourceMappingURL=app.js.map