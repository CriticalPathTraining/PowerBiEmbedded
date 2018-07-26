module myApp {


  $(() => {

    SpaAuthService.uiUpdateCallback = onAuthenticationCompleted;


    $("#dashboards").click(() => { getDashboards(); });
    $("#reports").click(() => { getReports(); });
    $("#datasets").click(() => { getDatasets(); });

    $("#login").click(() => {
      SpaAuthService.login();
    });

    $("#logout").click(() => {
      SpaAuthService.logout();
      refreshUi();
    });

    refreshUi();

  });

  var onAuthenticationCompleted = () => {
    refreshUi();
  }

  var refreshUi = () => {
    if (SpaAuthService.userIsAuthenticated) {
      $("#user-greeting").text(SpaAuthService.userName);
      $("#login").hide()
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
  }

  var reports: Report[];

  var getReports = () => {

    // reset embed container
    powerbi.reset(document.getElementById('embedContainer'));

    PowerBiService.GetReports().then((data) => {
      reports = data.value;
      $("#navigation").empty();
      $("#navigation").append($("<div>", { class: "nav-header" }).text("Reports"));
      var list = $("<ul>");
      for (var i = 0; i <= reports.length; i++) {
        var link = $("<a>", { class: "nav-link" }).text(reports[i].name);
        link.attr("href", "JavaScript:void(0)")
        link.click(onEmbedReport);
        var listItem = $("<li>", { class: "nav-item" }).append(link);
        $("#navigation").append(listItem);
      }
    });
  };

  var onEmbedReport = (event) => {
    var button: HTMLButtonElement = event.target;
    var reportName: string = button.innerText;
    for (var i = 0; i <= reports.length; i++) {
      if (reports[i].name == reportName) {
        embedReport(reports[i]);
      }
    }

  }

  var embedReport = (report: Report) => {

    // Get a reference to the embedded report HTML element
    var embedContainer = document.getElementById('embedContainer');

    // reset target div
    powerbi.reset(embedContainer);


    // data required for embedding Power BI report
    var embedReportId = report.id;
    var embedUrl = report.embedUrl;
    var accessToken = SpaAuthService.accessToken;

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


  }

  var dashboards: Dashboard[];

  var getDashboards = () => {

    // reset embed container
    powerbi.reset(document.getElementById('embedContainer'));

    PowerBiService.GetDashboards().then((data) => {
      dashboards = data.value;
      $("#navigation").empty();
      $("#navigation").append($("<div>", { class: "nav-header" }).text("Dashboards"));
      var list = $("<ul>");
      for (var i = 0; i < dashboards.length; i++) {
        console.log(dashboards[i]);
        var link = $("<a>", { class: "nav-link" }).text(dashboards[i].displayName);
        link.attr("href", "JavaScript:void(0)")
        link.click(onEmbedDashboard);
        var listItem = $("<li>", { class: "nav-item" }).append(link);
        $("#navigation").append(listItem);
      }
    });
  };

  var onEmbedDashboard = (event) => {
    var button: HTMLButtonElement = event.target;
    var dashboardName: string = button.innerText;
    for (var i = 0; i < dashboards.length; i++) {
      console.log(dashboards[i]);
      if (dashboards[i].displayName == dashboardName) {
        embedDashboard(dashboards[i]);
      }
    }

  }

  var embedDashboard = (dashboard: Dashboard) => {

    // Get a reference to the embedded report HTML element
    var embedContainer = document.getElementById('embedContainer');

    // reset target div
    powerbi.reset(embedContainer);

    // data required for embedding Power BI dashboard
    var embedDashboardId = dashboard.id;
    var embedUrl = dashboard.embedUrl
    var accessToken = SpaAuthService.accessToken;

    // Get models object to access enums for embed configuration
    var models = window['powerbi-client'].models;

    var config: any = {
      type: 'dashboard',
      id: embedDashboardId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Aad,
      pageView: "fitToWidth" // choices are "actualSize", "fitToWidth" or "oneColumn"
    };


    // Embed the report and display it within the div container.
    var embeddedDashboard = powerbi.embed(embedContainer, config);

  }

  var datasets: Dataset[];

  var getDatasets = () => {

    // reset embed container
    powerbi.reset(document.getElementById('embedContainer'));

    PowerBiService.GetDatasets().then((data) => {
      datasets = data.value;
      $("#navigation").empty();
      $("#navigation").append($("<div>", { class: "nav-header" }).text("Datasets"));
      var list = $("<ul>");
      for (var i = 0; i <= datasets.length; i++) {
        var link = $("<a>", { class: "nav-link" }).text(datasets[i].name);
        link.attr("href", "JavaScript:void(0)")
        link.click(onEmbedNewReport);
        var listItem = $("<li>", { class: "nav-item" }).append(link);
        $("#navigation").append(listItem);
      }
    });
  };

  var onEmbedNewReport = (event) => {
    var button: HTMLButtonElement = event.target;
    var datasetName: string = button.innerText;
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i].name == datasetName) {
        embedNewReport(datasets[i]);
      }
    }

  }

  var embedNewReport = (dataset: Dataset) => {

    // Get a reference to the embedded report HTML element
    var embedContainer = document.getElementById('embedContainer');

    // reset target div
    powerbi.reset(embedContainer);

    // Get data required for embedding
    var embedWorkspaceId = PowerBiService.appWorkspaceId;
    var embedDatasetId = dataset.id;
    var embedUrl = "https://app.powerbi.com/reportEmbed?groupId=" + PowerBiService.appWorkspaceId;
    var accessToken = SpaAuthService.accessToken;

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



  }

}
