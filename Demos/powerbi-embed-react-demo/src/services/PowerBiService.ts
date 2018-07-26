import {
  PowerBiDashboard,
  PowerBiReport,
  PowerBiDataset,
  PowerBiDashboardTile
}
  from "./../models/PowerBiModels";

import SpaAuthService from "./SpaAuthService";

export default class PowerBiService {

  static apiRoot: string = "https://api.powerbi.com/v1.0/myorg/";
  //  update this app workspace ID with an app workspace in your Office 365 tenant
  static appWorkspaceId = "acde6c78-31cf-422c-b06d-bd899fe8168a";
  static appWorkspaceApiRoot = PowerBiService.apiRoot + "groups/" + PowerBiService.appWorkspaceId + "/";

  static GetReports = (): Promise<PowerBiReport[]> => {
    var restUrl = PowerBiService.appWorkspaceApiRoot + "Reports/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });

  }

  static GetDashboards = (): Promise<PowerBiDashboard[]> => {
    var restUrl = PowerBiService.appWorkspaceApiRoot + "Dashboards/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetDashboardTiles = (dashboardId: string): Promise<PowerBiDashboardTile[]> => {
    var restUrl = PowerBiService.appWorkspaceApiRoot + "Dashboards/" + dashboardId + "/tiles/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetDatasets = (): Promise<PowerBiDataset[]> => {
    var restUrl = PowerBiService.appWorkspaceApiRoot + "Datasets/";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + SpaAuthService.accessToken
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }


}
