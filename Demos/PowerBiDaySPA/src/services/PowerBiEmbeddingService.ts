import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  PowerBiDashboardTile
} from "./../models/PowerBiModels";

import SpaAuthService from "./SpaAuthService";
import PowerBiService from "./PowerBiService";

import * as powerbi from "powerbi-client";
import * as pbimodels from "powerbi-models";

require('powerbi-models');
require('powerbi-client');

export default class PowerBiEmbeddingService {

  static reset(embedContainer: HTMLElement) {
    window.powerbi.reset(embedContainer);
  }

  static embedDashboard(dashboard: PowerBiDashboard, embedContainer: HTMLElement) {

    // data required for embedding Power BI dashboard
    var embedDashboardId = dashboard.id;
    var embedUrl = dashboard.embedUrl
    var accessToken = SpaAuthService.accessToken;
    var accessToken: string = SpaAuthService.accessToken;
    var models = pbimodels;

    var config: any = {
      type: 'dashboard',
      id: embedDashboardId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Aad,
      pageView: "fitToWidth" // choices are "actualSize", "fitToWidth" or "oneColumn"
    };

    window.powerbi.reset(embedContainer);
    window.powerbi.embed(embedContainer, config);

  }

  static embedDashboardTiles(dashboard: PowerBiDashboard, embedContainer: HTMLElement) {

    window.powerbi.reset(embedContainer);

    PowerBiService.GetDashboardTiles(dashboard.id).then((tiles: PowerBiDashboardTile[]) => {

      let tile: PowerBiDashboardTile = tiles[0];

      // data required for embedding Power BI dashboard
      var embedDashboardId = dashboard.id;
      var embedTileId = tile.tileId;
      var embedUrl = tile.embedUrl;
      var accessToken = SpaAuthService.accessToken;
      var models = pbimodels;

      var config = {
        type: 'tile',
        dashboardId: embedDashboardId,
        id: embedTileId,
        embedUrl: embedUrl,
        accessToken: accessToken,
        tokenType: models.TokenType.Aad,
        width: 600,
        height: 400
      };

      window.powerbi.embed(embedContainer, config);

    });

  }

  static embedReport(report: PowerBiReport, embedContainer: HTMLElement): powerbi.Report {

    var embedReportId: string = report.id;
    var embedUrl: string = report.embedUrl;
    var accessToken: string = SpaAuthService.accessToken;
    var models = pbimodels;

    var config: any = {
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
      }
    };

    window.powerbi.reset(embedContainer);
    return <powerbi.Report>window.powerbi.embed(embedContainer, config);

  }

  static embedNewReport(dataset: PowerBiDataset, embedContainer: HTMLElement) {

    // Get data required for embedding
    var embedWorkspaceId = PowerBiService.appWorkspaceId;
    var embedDatasetId = dataset.id;
    var embedUrl = "https://app.powerbi.com/reportEmbed";
    var accessToken = SpaAuthService.accessToken;
    var models = pbimodels;

    var config = {
      datasetId: embedDatasetId,
      embedUrl: embedUrl,
      accessToken: accessToken,
      tokenType: models.TokenType.Aad,
    };

    window.powerbi.reset(embedContainer);
    let report = window.powerbi.createReport(embedContainer, config);

    report.on("saved", (event: any) => {

      console.log("Saved");
      console.log(event.detail);

      // get ID and name of new report
      var newReportId = event.detail.reportObjectId;
      var newReportName = event.detail.reportName;

      window.powerbi.reset(embedContainer);

      let configSavedReport: any = {
        type: 'report',
        id: newReportId,
        embedUrl: "https://app.powerbi.com/reportEmbed?reportId=" + newReportId + "&groupId=" + embedWorkspaceId,
        accessToken: accessToken,
        tokenType: models.TokenType.Aad,
        permissions: models.Permissions.All,
        viewMode: models.ViewMode.Edit,
      };

      // Embed the report and display it within the div container.
      var report = window.powerbi.embed(embedContainer, configSavedReport);

    });


  }

  static embedQnA(dataset: PowerBiDataset, embedContainer: HTMLElement) {

    // Get data required for embedding
    var embedDatasetId = dataset.id;
    var embedUrl = "https://app.powerbi.com/qnaEmbed?groupId=" + PowerBiService.appWorkspaceId;
    var accessToken = SpaAuthService.accessToken;
    var models = pbimodels;


    var config = {
      type: 'qna',
      tokenType: models.TokenType.Aad,
      accessToken: accessToken,
      embedUrl: embedUrl,
      datasetIds: [embedDatasetId],
      viewMode: models.QnaMode.Interactive
      //,  question: "What is sales revenue by quarter and sales region as stacked area chart"
    };

    window.powerbi.reset(embedContainer);
    window.powerbi.embed(embedContainer, config);

  }
}