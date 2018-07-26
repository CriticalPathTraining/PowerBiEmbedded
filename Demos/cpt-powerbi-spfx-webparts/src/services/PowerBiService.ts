import {
  PowerBiWorkspace,
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  PowerBiDashboardTile
}
  from "./../models/PowerBiModels";

import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';

import * as powerbi from "powerbi-client";
import * as pbimodels from "powerbi-models";
import { IPowerBiElement } from 'service';

require('powerbi-models');
require('powerbi-client');

export class PowerBiService {

  private static powerbiApiResourceId = "https://analysis.windows.net/powerbi/api";

  private static workspacesUrl = "https://api.powerbi.com/v1.0/myorg/groups/";


  private static adalAccessTokenStorageKey: string = "adal.access.token.keyhttps://analysis.windows.net/powerbi/api";

  public static GetWorkspaces = (serviceScope: ServiceScope): Promise<PowerBiWorkspace[]> => {
    let pbiClient: AadHttpClient = new AadHttpClient(serviceScope, PowerBiService.powerbiApiResourceId);

    var reqHeaders: HeadersInit = new Headers();
    reqHeaders.append("Accept", "*");
    return pbiClient.get(PowerBiService.workspacesUrl, AadHttpClient.configurations.v1, { headers: reqHeaders })
      .then((response: HttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((workspacesOdataResult: any): PowerBiWorkspace[] => {
        return workspacesOdataResult.value;
      });
  }

  public static GetReports = (serviceScope: ServiceScope, workspaceId: string): Promise<PowerBiReport[]> => {

    let reportsUrl = PowerBiService.workspacesUrl + workspaceId + "/reports/";

    let pbiClient: AadHttpClient = new AadHttpClient(serviceScope, PowerBiService.powerbiApiResourceId);

    var reqHeaders: HeadersInit = new Headers();
    reqHeaders.append("Accept", "*");
    return pbiClient.get(reportsUrl, AadHttpClient.configurations.v1, { headers: reqHeaders })
      .then((response: HttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((reportsOdataResult: any): PowerBiReport[] => {
        return reportsOdataResult.value.map((report: PowerBiReport) => {
          return {
            id: report.id,
            embedUrl: report.embedUrl,
            name: report.name,
            webUrl: report.webUrl,
            datasetId: report.datasetId,
            accessToken: window.sessionStorage[PowerBiService.adalAccessTokenStorageKey]
          };
        });
      });
  }


  public static GetReport = (serviceScope: ServiceScope, workspaceId: string, reportId: string): Promise<PowerBiReport> => {
    let reportUrl = PowerBiService.workspacesUrl + workspaceId + "/reports/" + reportId + "/";
    let pbiClient: AadHttpClient = new AadHttpClient(serviceScope, PowerBiService.powerbiApiResourceId);
    var reqHeaders: HeadersInit = new Headers();
    reqHeaders.append("Accept", "*");
    return pbiClient.get(reportUrl, AadHttpClient.configurations.v1, { headers: reqHeaders })
      .then((response: HttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((reportsOdataResult: any): PowerBiReport => {
        return {
          id: reportsOdataResult.id,
          embedUrl: reportsOdataResult.embedUrl,
          name: reportsOdataResult.name,
          webUrl: reportsOdataResult.webUrl,
          datasetId: reportsOdataResult.datasetId,
          accessToken: window.sessionStorage[PowerBiService.adalAccessTokenStorageKey]
        };
      });
  }

  public static GetDashboards = (serviceScope: ServiceScope, workspaceId: string): Promise<PowerBiDashboard[]> => {
    let dashboardsUrl = PowerBiService.workspacesUrl + workspaceId + "/dashboards/";
    let pbiClient: AadHttpClient = new AadHttpClient(serviceScope, PowerBiService.powerbiApiResourceId);
    var reqHeaders: HeadersInit = new Headers();
    reqHeaders.append("Accept", "*");
    return pbiClient.get(dashboardsUrl, AadHttpClient.configurations.v1, { headers: reqHeaders })
      .then((response: HttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((dashboardsOdataResult: any): PowerBiDashboard[] => {
        return dashboardsOdataResult.value.map((dashboard: PowerBiDashboard) => {
          return {
            id: dashboard.id,
            embedUrl: dashboard.embedUrl,
            displayName: dashboard.displayName,
            accessToken: window.sessionStorage[PowerBiService.adalAccessTokenStorageKey]
          };
        });
      });
  }
  
  public static GetDashboard = (serviceScope: ServiceScope, workspaceId: string, dashboardId: string): Promise<PowerBiDashboard> => {
    let dashboardUrl = PowerBiService.workspacesUrl + workspaceId + "/dashboards/" + dashboardId + "/";
    let pbiClient: AadHttpClient = new AadHttpClient(serviceScope, PowerBiService.powerbiApiResourceId);
    var reqHeaders: HeadersInit = new Headers();
    reqHeaders.append("Accept", "*");
    return pbiClient.get(dashboardUrl, AadHttpClient.configurations.v1, { headers: reqHeaders })
      .then((response: HttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((dashboardOdataResult: any): PowerBiDashboard => {
        return {
          id: dashboardOdataResult.id,
          embedUrl: dashboardOdataResult.embedUrl,
          displayName: dashboardOdataResult.displayName,
          accessToken: window.sessionStorage[PowerBiService.adalAccessTokenStorageKey]
        };
      });
  }

}