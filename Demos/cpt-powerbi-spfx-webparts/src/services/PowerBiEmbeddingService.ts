import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  PowerBiDashboardTile
}
  from "./../models/PowerBiModels";

import { PowerBiService } from "./PowerBiService";

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";


export class PowerBiEmbeddingService {

  public static reset(embedContainer: HTMLElement) {
    window.powerbi.reset(embedContainer);
  }

  public static embedDashboard(dashboard: PowerBiDashboard, embedContainer: HTMLElement) {

    var config: any = {
      type: 'dashboard',
      id: dashboard.id,
      embedUrl: dashboard.embedUrl,
      accessToken: dashboard.accessToken,
      tokenType: models.TokenType.Aad,
      pageView: "fitToWidth" // choices are "actualSize", "fitToWidth" or "oneColumn"
    };

    window.powerbi.reset(embedContainer);
    window.powerbi.embed(embedContainer, config);

  }

  public static embedDashboardTiles(dashboard: PowerBiDashboard, embedContainer: HTMLElement) {



  }

  public static embedReport(report: PowerBiReport, embedContainer: HTMLElement) {

    console.log("embed report");
    console.log(embedContainer);
    
    require('powerbi-models');
    require('powerbi-client');



    var config: any = {
      type: 'report',
      id: report.id,
      embedUrl: report.embedUrl,
      accessToken: report.accessToken,
      tokenType: models.TokenType.Aad,
      permissions: models.Permissions.All,
      viewMode: models.ViewMode.View,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: true,
      }
    };

    window.powerbi.reset(embedContainer);
    window.powerbi.embed(embedContainer, config);
  }

  public  static embedNewReport(dataset: PowerBiDataset, embedContainer: HTMLElement) {

    var config = {
      datasetId: dataset.id,
      embedUrl: dataset.embedUrl,
      accessToken: dataset.accessToken,
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
        embedUrl: ("https://app.powerbi.com/reportEmbed?reportId=" + newReportId + "&groupId=" + dataset.workspaceId),
        accessToken: dataset.accessToken,
        tokenType: models.TokenType.Aad,
        permissions: models.Permissions.All,
        viewMode: models.ViewMode.Edit,
      };

      // Embed the report and display it within the div container.
      var embeddedReport = window.powerbi.embed(embedContainer, configSavedReport);

    });


  }

  public static embedQnA(dataset: PowerBiDataset, embedContainer: HTMLElement) {

    var config = {
      type: 'qna',
      tokenType: models.TokenType.Aad,
      accessToken: dataset.accessToken,
      embedUrl: dataset.embedUrl,
      datasetIds: [dataset.id],
      viewMode: models.QnaMode.Interactive
      //,  question: "What is sales revenue by quarter and sales region as stacked area chart"
    };

    window.powerbi.reset(embedContainer);
    window.powerbi.embed(embedContainer, config);

  }
}